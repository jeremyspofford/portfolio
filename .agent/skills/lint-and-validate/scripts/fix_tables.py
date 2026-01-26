import sys
import re
import unicodedata

def get_visual_width(s):
    width = 0
    for char in s:
        # unicodedata.east_asian_width handles most wide characters
        if unicodedata.east_asian_width(char) in ('W', 'F'):
            width += 2
        else:
            width += 1
    return width

def align_table(table_lines):
    if not table_lines:
        return []
    
    # Parse rows
    rows = []
    for line in table_lines:
        cells = [cell.strip() for cell in line.strip().split('|')]
        if cells and not cells[0]: cells = cells[1:]
        if cells and not cells[-1]: cells = cells[:-1]
        rows.append(cells)
    
    if not rows:
        return table_lines

    num_cols = max(len(row) for row in rows)
    col_widths = [0] * num_cols
    
    for row in rows:
        for i, cell in enumerate(row):
            if i < num_cols:
                col_widths[i] = max(col_widths[i], get_visual_width(cell))
    
    # Reconstruct table
    result = []
    for i, row in enumerate(rows):
        formatted_cells = []
        for j in range(num_cols):
            cell = row[j] if j < len(row) else ""
            width = get_visual_width(cell)
            padding = col_widths[j] - width
            
            if i == 1: # Separator row
                # Check if it's already a separator row
                if all(c in '-:' for c in cell):
                    formatted_cells.append(' ' + '-' * col_widths[j] + ' ')
                else:
                    formatted_cells.append(' ' + cell + '-' * padding + ' ')
            else:
                formatted_cells.append(' ' + cell + ' ' * padding + ' ')
        result.append('|' + '|'.join(formatted_cells) + '|')
    
    return result

def process_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    table_buffer = []
    in_table = False
    
    for line in lines:
        if re.match(r'^\s*\|', line):
            in_table = True
            table_buffer.append(line)
        else:
            if in_table:
                new_lines.extend([l + '\n' for l in align_table(table_buffer)])
                table_buffer = []
                in_table = False
            new_lines.append(line)
    
    if in_table:
        new_lines.extend([l + '\n' for l in align_table(table_buffer)])
    
    with open(filepath, 'w') as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        process_file(arg)
