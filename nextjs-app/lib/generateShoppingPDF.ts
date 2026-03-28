import type { ShoppingItem } from '@/types/database'

interface PDFOptions {
  weekLabel: string
  items: ShoppingItem[]
}

export async function generateShoppingPDF({ weekLabel, items }: PDFOptions): Promise<void> {
  // Dynamic import — jsPDF is browser-only
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const PAGE_W = 210
  const PAGE_H = 297
  const MARGIN = 16
  const COL_W = (PAGE_W - MARGIN * 3) / 2
  const PRIMARY = [0, 180, 166] as [number, number, number]

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, PAGE_W, 36, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Shopping List', MARGIN, 15)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(weekLabel, MARGIN, 23)

  const checked = items.filter((i) => i.is_purchased).length
  doc.text(`${checked}/${items.length} items checked`, PAGE_W - MARGIN, 23, { align: 'right' })

  // ── Group by category ────────────────────────────────────
  const grouped = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category || 'Other'
    ;(acc[cat] = acc[cat] ?? []).push(item)
    return acc
  }, {})

  const categories = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))

  // Flatten into rows with category headers
  interface Row {
    type: 'header' | 'item'
    label?: string
    item?: ShoppingItem
  }
  const rows: Row[] = []
  categories.forEach(([cat, catItems]) => {
    rows.push({ type: 'header', label: cat })
    catItems.forEach((item) => rows.push({ type: 'item', item }))
  })

  // ── Two-column layout ────────────────────────────────────
  const startY = 46
  const rowH = 7
  const maxRowsPerCol = Math.floor((PAGE_H - startY - 40) / rowH)

  const col1Rows = rows.slice(0, maxRowsPerCol)
  const col2Rows = rows.slice(maxRowsPerCol)

  const renderRows = (colRows: Row[], offsetX: number) => {
    let y = startY

    colRows.forEach((row) => {
      if (row.type === 'header') {
        doc.setFillColor(240, 253, 250)
        doc.rect(offsetX, y - 4, COL_W, rowH, 'F')

        doc.setTextColor(...PRIMARY)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text((row.label ?? '').toUpperCase(), offsetX + 2, y + 1)
        y += rowH
        return
      }

      const item = row.item!
      doc.setTextColor(55, 65, 81)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')

      // Checkbox
      const cbX = offsetX + 2
      const cbY = y - 2.5
      doc.setDrawColor(200, 200, 200)
      doc.rect(cbX, cbY, 4, 4)
      if (item.is_purchased) {
        doc.setDrawColor(...PRIMARY)
        doc.setLineWidth(0.6)
        doc.line(cbX + 0.5, cbY + 2, cbX + 1.5, cbY + 3.2)
        doc.line(cbX + 1.5, cbY + 3.2, cbX + 3.5, cbY + 0.8)
        doc.setLineWidth(0.2)
        doc.setDrawColor(200, 200, 200)
      }

      // Name
      const nameColor: [number, number, number] = item.is_purchased ? [156, 163, 175] : [55, 65, 81]
      doc.setTextColor(...nameColor)
      const name = item.ingredient_name.charAt(0).toUpperCase() + item.ingredient_name.slice(1)
      doc.text(name, cbX + 6, y + 0.5)

      // Amount + unit
      if (item.total_amount) {
        doc.setTextColor(0, 180, 166)
        doc.setFont('helvetica', 'bold')
        doc.text(
          `${item.total_amount} ${item.unit}`,
          offsetX + COL_W - 2,
          y + 0.5,
          { align: 'right' }
        )
        doc.setFont('helvetica', 'normal')
      }

      // Separator line
      doc.setDrawColor(243, 244, 246)
      doc.line(offsetX, y + 3, offsetX + COL_W, y + 3)

      y += rowH
    })
  }

  renderRows(col1Rows, MARGIN)
  if (col2Rows.length > 0) {
    renderRows(col2Rows, MARGIN * 2 + COL_W)
    // Vertical divider
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.3)
    doc.line(MARGIN + COL_W + MARGIN / 2, startY - 4, MARGIN + COL_W + MARGIN / 2, PAGE_H - 40)
  }

  // ── Footer ───────────────────────────────────────────────
  const footerY = PAGE_H - 30
  doc.setDrawColor(229, 231, 235)
  doc.line(MARGIN, footerY, PAGE_W - MARGIN, footerY)

  doc.setTextColor(156, 163, 175)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Notes:', MARGIN, footerY + 6)
  doc.setDrawColor(229, 231, 235)
  doc.line(MARGIN + 10, footerY + 6, PAGE_W - MARGIN, footerY + 6)
  doc.line(MARGIN, footerY + 12, PAGE_W - MARGIN, footerY + 12)

  doc.setFillColor(...PRIMARY)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text('Meal Prep App', PAGE_W / 2, PAGE_H - 8, { align: 'center' })

  // ── Save ─────────────────────────────────────────────────
  const safeLabel = weekLabel.replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '-')
  doc.save(`shopping-list-${safeLabel}.pdf`)
}
