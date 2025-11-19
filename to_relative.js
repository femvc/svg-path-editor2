/**
 * 将任意大小写 path commands 转成全绝对（大写）
 * @param {Array<{type: string, params: number[]}>} commands
 * @returns 同结构的新数组，type 全为大写
 */
function toAbsolute(commands, aIndex) {
  let cx = 0, cy = 0;        // current point
  let sx = 0, sy = 0;        // current subpath start
  const result = [];

  for (const cmd of commands) {
    let type = cmd.type;
    let params = cmd.params.slice(); // copy
    const isRel = type === type.toLowerCase();
    const T = type.toUpperCase();

    // 如果是相对命令，先转成绝对坐标
    if (isRel) {
      switch (T) {
        case 'M':
        case 'L':
        case 'T':
          for (let i = 0; i < params.length; i += 2) {
            params[i]   += cx;
            params[i+1] += cy;
            cx = params[i];
            cy = params[i+1];
            if (T === 'M' && i === 0) {
              sx = cx; sy = cy;
            }
          }
          break;
        case 'H':
          for (let i = 0; i < params.length; i++) {
            params[i] += cx;
            cx = params[i];
          }
          break;
        case 'V':
          for (let i = 0; i < params.length; i++) {
            params[i] += cy;
            cy = params[i];
          }
          break;
        case 'C':
          for (let i = 0; i < params.length; i += 6) {
            params[i]   += cx; params[i+1] += cy;
            params[i+2] += cx; params[i+3] += cy;
            params[i+4] += cx; params[i+5] += cy;
            cx = params[i+4];
            cy = params[i+5];
          }
          break;
        case 'S':
        case 'Q':
          for (let i = 0; i < params.length; i += 4) {
            params[i]   += cx; params[i+1] += cy;
            params[i+2] += cx; params[i+3] += cy;
            cx = params[i+2];
            cy = params[i+3];
          }
          break;
        case 'A':
          for (let i = 0; i < params.length; i += 7) {
            // rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
            params[i+5] += cx;
            params[i+6] += cy;
            cx = params[i+5];
            cy = params[i+6];
          }
          break;
        case 'Z':
          // 回到子路径起点
          cx = sx; cy = sy;
          break;
      }
    } else {
      // 已经是绝对命令，同步 current point
      switch (T) {
        case 'M':
        case 'L':
        case 'T':
          for (let i = 0; i < params.length; i += 2) {
            cx = params[i];
            cy = params[i+1];
            if (T === 'M' && i === 0) {
              sx = cx; sy = cy;
            }
          }
          break;
        case 'H':
          for (let i = 0; i < params.length; i++) {
            cx = params[i];
          }
          break;
        case 'V':
          for (let i = 0; i < params.length; i++) {
            cy = params[i];
          }
          break;
        case 'C':
          for (let i = 0; i < params.length; i += 6) {
            cx = params[i+4];
            cy = params[i+5];
          }
          break;
        case 'S':
        case 'Q':
          for (let i = 0; i < params.length; i += 4) {
            cx = params[i+2];
            cy = params[i+3];
          }
          break;
        case 'A':
          for (let i = 0; i < params.length; i += 7) {
            cx = params[i+5];
            cy = params[i+6];
          }
          break;
        case 'Z':
          cx = sx; cy = sy;
          break;
      }
    }

    result.push({ type: T, params });
  }
  if (typeof aIndex === 'number') {
    return result[aIndex];
  } else return result;
}

/**
 * 将任意大小写 path commands 转成全相对（小写）
 * 内部先调用 toAbsolute，再转相对
 * @param {Array<{type: string, params: number[]}>} commands
 * @returns 同结构的新数组，type 全为小写
 */
function toRelative(commands, aIndex) {
  const abs = toAbsolute(commands);
  let cx = 0, cy = 0;       // current point
  let sx = 0, sy = 0;       // subpath start
  const result = [];

  for (const cmd of abs) {
    const T = cmd.type;     // 已经是大写
    const type = T.toLowerCase();
    const paramsAbs = cmd.params.slice();
    const paramsRel = paramsAbs.slice(); // 会被改成相对值

    switch (T) {
      case 'M':
      case 'L':
      case 'T':
        for (let i = 0; i < paramsAbs.length; i += 2) {
          const x = paramsAbs[i];
          const y = paramsAbs[i+1];
          paramsRel[i]   = x - cx;
          paramsRel[i+1] = y - cy;
          cx = x;
          cy = y;
          if (T === 'M' && i === 0) {
            sx = cx; sy = cy;
          }
        }
        break;
      case 'H':
        for (let i = 0; i < paramsAbs.length; i++) {
          const x = paramsAbs[i];
          paramsRel[i] = x - cx;
          cx = x;
        }
        break;
      case 'V':
        for (let i = 0; i < paramsAbs.length; i++) {
          const y = paramsAbs[i];
          paramsRel[i] = y - cy;
          cy = y;
        }
        break;
      case 'C':
        for (let i = 0; i < paramsAbs.length; i += 6) {
          const x1 = paramsAbs[i],   y1 = paramsAbs[i+1];
          const x2 = paramsAbs[i+2], y2 = paramsAbs[i+3];
          const x  = paramsAbs[i+4], y  = paramsAbs[i+5];

          paramsRel[i]   = x1 - cx; paramsRel[i+1] = y1 - cy;
          paramsRel[i+2] = x2 - cx; paramsRel[i+3] = y2 - cy;
          paramsRel[i+4] = x  - cx; paramsRel[i+5] = y  - cy;

          cx = x; cy = y;
        }
        break;
      case 'S':
      case 'Q':
        for (let i = 0; i < paramsAbs.length; i += 4) {
          const x1 = paramsAbs[i],   y1 = paramsAbs[i+1];
          const x  = paramsAbs[i+2], y  = paramsAbs[i+3];

          paramsRel[i]   = x1 - cx; paramsRel[i+1] = y1 - cy;
          paramsRel[i+2] = x  - cx; paramsRel[i+3] = y  - cy;

          cx = x; cy = y;
        }
        break;
      case 'A':
        for (let i = 0; i < paramsAbs.length; i += 7) {
          const x = paramsAbs[i+5];
          const y = paramsAbs[i+6];

          // rx, ry, x-axis-rotation, large-arc-flag, sweep-flag 不变
          paramsRel[i+5] = x - cx;
          paramsRel[i+6] = y - cy;

          cx = x; cy = y;
        }
        break;
      case 'Z':
        cx = sx; cy = sy;
        // Z/z 没有 params
        break;
    }

    result.push({ type, params: paramsRel });
  }

  if (typeof aIndex === 'number') {
    return result[aIndex];
  } else return result;
}


function autoTransformCommand(commands, aIndex) {
  if (typeof aIndex !== 'number')  return commands;
  
  const cmd = commands[aIndex];
  if (cmd.type === cmd.type.toUpperCase()) {
    return toRelative(commands, aIndex);
  } else {
    return toAbsolute(commands, aIndex);
  }
}