(() => {
  const MIME =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  function exportQueryWorkbook({
    title,
    subtitle,
    headers,
    rows,
    fileName,
    columnWidths,
  }) {
    const matrix = [
      [title, ...Array(Math.max(headers.length - 1, 0)).fill("")],
      [subtitle, ...Array(Math.max(headers.length - 1, 0)).fill("")],
      headers,
      ...rows,
    ];
    const bytes = buildXlsx(matrix, columnWidths);
    const url = URL.createObjectURL(new Blob([bytes], { type: MIME }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildXlsx(matrix, widths) {
    const files = new Map();
    files.set(
      "[Content_Types].xml",
      encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      ),
    );
    files.set(
      "_rels/.rels",
      encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      ),
    );
    files.set(
      "xl/workbook.xml",
      encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="查询结果" sheetId="1" r:id="rId1"/></sheets></workbook>',
      ),
    );
    files.set(
      "xl/_rels/workbook.xml.rels",
      encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      ),
    );
    files.set("xl/styles.xml", encode(stylesXml()));
    files.set("xl/worksheets/sheet1.xml", encode(sheetXml(matrix, widths)));
    return zip(files);
  }

  function sheetXml(matrix, widths) {
    const columnCount = matrix[0].length;
    const lastColumn = columnName(columnCount);
    const lastRow = matrix.length;
    const cols = widths
      .map(
        (width, index) =>
          `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`,
      )
      .join("");
    const rows = matrix
      .map((row, rowIndex) => {
        const height = rowIndex === 0 ? 28 : rowIndex === 1 ? 20 : 22;
        return `<row r="${rowIndex + 1}" ht="${height}" customHeight="1">${row
          .map((cell, columnIndex) => cellXml(cell, rowIndex, columnIndex))
          .join("")}</row>`;
      })
      .join("");
    const range = `A3:${lastColumn}${lastRow}`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="20"/><cols>${cols}</cols><sheetData>${rows}</sheetData><mergeCells count="2"><mergeCell ref="A1:${lastColumn}1"/><mergeCell ref="A2:${lastColumn}2"/></mergeCells><autoFilter ref="${range}"/></worksheet>`;
  }

  function cellXml(value, rowIndex, columnIndex) {
    const reference = `${columnName(columnIndex + 1)}${rowIndex + 1}`;
    const style = cellStyle(rowIndex, columnIndex);
    return `<c r="${reference}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(
      String(value ?? ""),
    )}</t></is></c>`;
  }

  function cellStyle(rowIndex, columnIndex) {
    if (rowIndex === 0) return 1;
    if (rowIndex === 1) return 2;
    if (rowIndex === 2) return 3;
    if (columnIndex === 2) return 5;
    return rowIndex % 2 === 0 ? 6 : 4;
  }

  function stylesXml() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="4"><font><sz val="10"/><name val="Microsoft YaHei"/><family val="2"/><charset val="134"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="14"/><name val="Microsoft YaHei"/><family val="2"/><charset val="134"/></font><font><color rgb="FF5A6472"/><sz val="10"/><name val="Microsoft YaHei"/><family val="2"/><charset val="134"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="10"/><name val="Microsoft YaHei"/><family val="2"/><charset val="134"/></font></fonts><fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2A44"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF5F3EA"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF7F9FC"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD4DCE7"/></left><right style="thin"><color rgb="FFD4DCE7"/></right><top style="thin"><color rgb="FFD4DCE7"/></top><bottom style="thin"><color rgb="FFD4DCE7"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="7"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyAlignment="1" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="3" borderId="0" xfId="0" applyAlignment="1" applyFont="1" applyFill="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyAlignment="1" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyAlignment="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyAlignment="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyAlignment="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  }

  function columnName(value) {
    let name = "";
    while (value > 0) {
      const remainder = (value - 1) % 26;
      name = String.fromCharCode(65 + remainder) + name;
      value = Math.floor((value - 1) / 26);
    }
    return name;
  }

  function escapeXml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function encode(value) {
    return new TextEncoder().encode(value);
  }

  function zip(files) {
    const local = [];
    const central = [];
    let offset = 0;
    for (const [name, data] of files) {
      const nameBytes = encode(name);
      const checksum = crc32(data);
      const entry = concat(
        u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(checksum), u32(data.length), u32(data.length), u16(nameBytes.length),
        u16(0), nameBytes, data,
      );
      local.push(entry);
      central.push(concat(
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(checksum), u32(data.length), u32(data.length), u16(nameBytes.length),
        u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes,
      ));
      offset += entry.length;
    }
    const centralSize = central.reduce((sum, item) => sum + item.length, 0);
    return concat(
      ...local,
      ...central,
      u32(0x06054b50), u16(0), u16(0), u16(files.size), u16(files.size),
      u32(centralSize), u32(offset), u16(0),
    );
  }

  function concat(...parts) {
    const output = new Uint8Array(parts.reduce((sum, item) => sum + item.length, 0));
    let offset = 0;
    for (const part of parts) {
      output.set(part, offset);
      offset += part.length;
    }
    return output;
  }

  function u16(value) {
    const bytes = new Uint8Array(2);
    new DataView(bytes.buffer).setUint16(0, value, true);
    return bytes;
  }

  function u32(value) {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(0, value >>> 0, true);
    return bytes;
  }

  const crcTable = new Uint32Array(256).map((_, index) => {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    return crc >>> 0;
  });

  function crc32(data) {
    let crc = 0xffffffff;
    for (const byte of data) {
      crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  window.exportQueryWorkbook = exportQueryWorkbook;
})();
