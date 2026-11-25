import { DifficultyLevel, MathQuestion, OperationType } from '../types/math';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateDistractors(correctAnswer: number, count = 3, range = 10): number[] {
  const distractors = new Set<number>();

  // Plausible offsets: +/- 1, +/- 2, +/- 10, +/- 5, inverted digits
  const offsets = [-1, 1, -2, 2, -10, 10, -5, 5, -3, 3, -20, 20];
  shuffleArray(offsets);

  for (const offset of offsets) {
    const candidate = correctAnswer + offset;
    if (candidate !== correctAnswer && (correctAnswer >= 0 ? candidate >= 0 : true)) {
      distractors.add(candidate);
      if (distractors.size === count) break;
    }
  }

  // Fallback if needed
  let delta = 1;
  while (distractors.size < count) {
    const candidate1 = correctAnswer + delta + getRandomInt(1, Math.max(3, range));
    const candidate2 = correctAnswer - delta - getRandomInt(1, Math.max(3, range));
    if (candidate1 !== correctAnswer) distractors.add(candidate1);
    if (distractors.size < count && candidate2 !== correctAnswer && candidate2 >= 0) {
      distractors.add(candidate2);
    }
    delta += 2;
  }

  return Array.from(distractors).slice(0, count);
}

export function generateQuestion(
  operation: OperationType,
  difficulty: DifficultyLevel,
  stage = 1
): MathQuestion {
  const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const extraStage = Math.max(0, Math.min(stage - 5, 5));

  switch (operation) {
    case 'addition': {
      let a: number;
      let b: number;
      if (difficulty === 'beginner') {
        a = getRandomInt(1, 9);
        b = getRandomInt(1, 9);
      } else if (difficulty === 'easy') {
        a = getRandomInt(10, 39);
        b = getRandomInt(10, 39);
      } else if (difficulty === 'medium') {
        a = getRandomInt(25, 99);
        b = getRandomInt(25, 99);
      } else if (difficulty === 'hard') {
        a = getRandomInt(110, 650);
        b = getRandomInt(110, 450);
      } else {
        a = getRandomInt(750 + extraStage * 300, 4999 + extraStage * 1000);
        b = getRandomInt(650 + extraStage * 300, 4999 + extraStage * 1000);
      }

      const answer = a + b;
      const distractors = generateDistractors(answer, 3, 15);
      const options = shuffleArray([answer, ...distractors]);

      return {
        id,
        operation,
        difficulty,
        questionText: `${a} + ${b} = ?`,
        operand1: a,
        operand2: b,
        operatorSymbol: '+',
        correctAnswer: answer,
        options,
        explanation: {
          fr: `${a} + ${b} = ${answer}. Astuce : décomposez ${b} en dizaines et unités (${a} + ${Math.floor(b / 10) * 10} + ${b % 10} = ${answer}).`,
          en: `${a} + ${b} = ${answer}. Tip: break ${b} into tens and units (${a} + ${Math.floor(b / 10) * 10} + ${b % 10} = ${answer}).`,
        },
        hint: {
          fr: `Ajoutez d'abord les dizaines, puis les unités !`,
          en: `Add the tens first, then the single digits!`,
        },
      };
    }

    case 'subtraction': {
      let a: number;
      let b: number;
      if (difficulty === 'beginner') {
        a = getRandomInt(4, 12);
        b = getRandomInt(1, a);
      } else if (difficulty === 'easy') {
        a = getRandomInt(15, 49);
        b = getRandomInt(5, a - 1);
      } else if (difficulty === 'medium') {
        a = getRandomInt(40, 120);
        b = getRandomInt(15, a - 5);
      } else if (difficulty === 'hard') {
        a = getRandomInt(150, 750);
        b = getRandomInt(65, a - 10);
      } else {
        a = getRandomInt(800 + extraStage * 400, 3500 + extraStage * 1000);
        b = getRandomInt(300 + extraStage * 150, a - 50);
      }

      const answer = a - b;
      const distractors = generateDistractors(answer, 3, 15);
      const options = shuffleArray([answer, ...distractors]);

      return {
        id,
        operation,
        difficulty,
        questionText: `${a} − ${b} = ?`,
        operand1: a,
        operand2: b,
        operatorSymbol: '−',
        correctAnswer: answer,
        options,
        explanation: {
          fr: `${a} − ${b} = ${answer}. Vérification : ${answer} + ${b} = ${a}.`,
          en: `${a} − ${b} = ${answer}. Verification: ${answer} + ${b} = ${a}.`,
        },
        hint: {
          fr: `Pensez à l'écart entre ${b} et ${a}.`,
          en: `Think of the distance between ${b} and ${a}.`,
        },
      };
    }

    case 'multiplication': {
      let a: number;
      let b: number;
      if (difficulty === 'beginner') {
        const tables = [2, 3, 5, 10];
        a = tables[getRandomInt(0, tables.length - 1)];
        b = getRandomInt(1, 10);
      } else if (difficulty === 'easy') {
        a = getRandomInt(3, 9);
        b = getRandomInt(2, 9);
      } else if (difficulty === 'medium') {
        a = getRandomInt(6, 12);
        b = getRandomInt(6, 15);
      } else if (difficulty === 'hard') {
        a = getRandomInt(13, 29);
        b = getRandomInt(6, 16);
      } else {
        a = getRandomInt(24 + extraStage * 5, 75 + extraStage * 12);
        b = getRandomInt(12 + extraStage * 2, 45 + extraStage * 8);
      }

      const answer = a * b;
      const distractors = generateDistractors(answer, 3, Math.max(10, Math.floor(answer * 0.15)));
      const options = shuffleArray([answer, ...distractors]);

      return {
        id,
        operation,
        difficulty,
        questionText: `${a} × ${b} = ?`,
        operand1: a,
        operand2: b,
        operatorSymbol: '×',
        correctAnswer: answer,
        options,
        explanation: {
          fr: `${a} × ${b} = ${answer}. Astuce : multiplier par ${b} revient à additionner ${a}, ${b} fois.`,
          en: `${a} × ${b} = ${answer}. Tip: multiplying by ${b} is the same as adding ${a}, ${b} times.`,
        },
        hint: {
          fr: `Rappelez-vous de la table de ${Math.min(a, b)} !`,
          en: `Recall the times table for ${Math.min(a, b)}!`,
        },
      };
    }

    case 'division': {
      let divisor: number;
      let quotient: number;

      if (difficulty === 'beginner') {
        divisor = getRandomInt(2, 5);
        quotient = getRandomInt(1, 9);
      } else if (difficulty === 'easy') {
        divisor = getRandomInt(2, 9);
        quotient = getRandomInt(2, 10);
      } else if (difficulty === 'medium') {
        divisor = getRandomInt(4, 12);
        quotient = getRandomInt(8, 20);
      } else if (difficulty === 'hard') {
        divisor = getRandomInt(6, 15);
        quotient = getRandomInt(15, 45);
      } else {
        divisor = getRandomInt(12 + extraStage * 3, 35 + extraStage * 6);
        quotient = getRandomInt(25 + extraStage * 5, 80 + extraStage * 15);
      }

      const dividend = divisor * quotient;
      const answer = quotient;
      const distractors = generateDistractors(answer, 3, 5);
      const options = shuffleArray([answer, ...distractors]);

      return {
        id,
        operation,
        difficulty,
        questionText: `${dividend} ÷ ${divisor} = ?`,
        operand1: dividend,
        operand2: divisor,
        operatorSymbol: '÷',
        correctAnswer: answer,
        options,
        explanation: {
          fr: `${dividend} ÷ ${divisor} = ${answer}. Car ${answer} × ${divisor} = ${dividend}.`,
          en: `${dividend} ÷ ${divisor} = ${answer}. Because ${answer} × ${divisor} = ${dividend}.`,
        },
        hint: {
          fr: `Combien de fois ${divisor} rentre-t-il dans ${dividend} ?`,
          en: `How many times does ${divisor} fit into ${dividend}?`,
        },
      };
    }

    case 'mental_math': {
      // Progressive mixed chaining across all 5 levels
      if (difficulty === 'beginner') {
        const a = getRandomInt(3, 12);
        const b = getRandomInt(2, 9);
        const c = getRandomInt(1, Math.min(8, a + b - 1));
        const answer = a + b - c;
        const distractors = generateDistractors(answer, 3, 5);
        return {
          id,
          operation,
          difficulty,
          questionText: `${a} + ${b} − ${c} = ?`,
          operatorSymbol: '±',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `${a} + ${b} = ${a + b}, puis ${a + b} − ${c} = ${answer}.`,
            en: `${a} + ${b} = ${a + b}, then ${a + b} − ${c} = ${answer}.`,
          },
        };
      } else if (difficulty === 'easy') {
        const a = getRandomInt(12, 35);
        const b = getRandomInt(6, 18);
        const c = getRandomInt(4, 14);
        const answer = a + b - c;
        const distractors = generateDistractors(answer, 3, 6);
        return {
          id,
          operation,
          difficulty,
          questionText: `${a} + ${b} − ${c} = ?`,
          operatorSymbol: '±',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `${a} + ${b} = ${a + b}, puis ${a + b} − ${c} = ${answer}.`,
            en: `${a} + ${b} = ${a + b}, then ${a + b} − ${c} = ${answer}.`,
          },
        };
      } else if (difficulty === 'medium') {
        const a = getRandomInt(3, 8);
        const b = getRandomInt(3, 9);
        const c = getRandomInt(5, 25);
        const answer = a * b + c;
        const distractors = generateDistractors(answer, 3, 10);
        return {
          id,
          operation,
          difficulty,
          questionText: `(${a} × ${b}) + ${c} = ?`,
          operatorSymbol: '×+',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `Priorité aux parenthèses : ${a} × ${b} = ${a * b}, puis ${a * b} + ${c} = ${answer}.`,
            en: `Parentheses first: ${a} × ${b} = ${a * b}, then ${a * b} + ${c} = ${answer}.`,
          },
        };
      } else if (difficulty === 'hard') {
        const a = getRandomInt(6, 14);
        const b = getRandomInt(5, 12);
        const c = getRandomInt(8, 35);
        const answer = a * b - c;
        const distractors = generateDistractors(answer, 3, 12);
        return {
          id,
          operation,
          difficulty,
          questionText: `(${a} × ${b}) − ${c} = ?`,
          operatorSymbol: '×−',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `${a} × ${b} = ${a * b}, puis ${a * b} − ${c} = ${answer}.`,
            en: `${a} × ${b} = ${a * b}, then ${a * b} − ${c} = ${answer}.`,
          },
        };
      } else {
        const a = getRandomInt(11 + extraStage * 2, 24 + extraStage * 4);
        const b = getRandomInt(6, 14 + extraStage);
        const c = getRandomInt(15, 65 + extraStage * 10);
        const answer = a * b + c;
        const distractors = generateDistractors(answer, 3, 18);
        return {
          id,
          operation,
          difficulty,
          questionText: `(${a} × ${b}) + ${c} = ?`,
          operatorSymbol: '×+',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `${a} × ${b} = ${a * b}, puis ${a * b} + ${c} = ${answer}.`,
            en: `${a} × ${b} = ${a * b}, then ${a * b} + ${c} = ${answer}.`,
          },
        };
      }
    }

    case 'square_root': {
      const rootsPool =
        difficulty === 'beginner' || difficulty === 'easy'
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          : difficulty === 'medium'
          ? [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
          : [12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30];

      const root = rootsPool[getRandomInt(0, rootsPool.length - 1)];
      const square = root * root;
      const answer = root;
      const distractors = generateDistractors(answer, 3, 4);
      const options = shuffleArray([answer, ...distractors]);

      return {
        id,
        operation,
        difficulty,
        questionText: `√${square} = ?`,
        operand1: square,
        operatorSymbol: '√',
        correctAnswer: answer,
        options,
        explanation: {
          fr: `√${square} = ${root}, car ${root} × ${root} = ${square}.`,
          en: `√${square} = ${root}, because ${root} × ${root} = ${square}.`,
        },
        hint: {
          fr: `Quel nombre multiplié par lui-même donne ${square} ?`,
          en: `Which number multiplied by itself gives ${square}?`,
        },
      };
    }

    case 'percentage': {
      const pList =
        difficulty === 'beginner' || difficulty === 'easy'
          ? [10, 20, 25, 50]
          : [5, 15, 20, 25, 30, 40, 50, 75];

      const pct = pList[getRandomInt(0, pList.length - 1)];
      const base = getRandomInt(2, 20) * (100 / (pct === 25 || pct === 75 ? 25 : pct === 50 ? 50 : 10));
      const answer = Math.round((base * pct) / 100);
      const distractors = generateDistractors(answer, 3, Math.max(5, Math.floor(answer * 0.2)));

      return {
        id,
        operation,
        difficulty,
        questionText: `${pct}% de ${base} = ?`,
        operatorSymbol: '%',
        correctAnswer: answer,
        options: shuffleArray([answer, ...distractors]),
        explanation: {
          fr: `${pct}% de ${base} = (${base} × ${pct}) / 100 = ${answer}.`,
          en: `${pct}% of ${base} = (${base} × ${pct}) / 100 = ${answer}.`,
        },
        hint: {
          fr: pct === 50 ? 'Prenez la moitié !' : pct === 25 ? 'Divisez par 4 !' : 'Calculez d’abord 10% !',
          en: pct === 50 ? 'Take half!' : pct === 25 ? 'Divide by 4!' : 'Calculate 10% first!',
        },
      };
    }

    case 'power': {
      let base: number;
      let exp: number;
      if (difficulty === 'beginner' || difficulty === 'easy') {
        base = getRandomInt(2, 6);
        exp = 2;
      } else if (difficulty === 'medium') {
        base = getRandomInt(2, 5);
        exp = getRandomInt(2, 3);
      } else {
        base = getRandomInt(2, 4);
        exp = getRandomInt(3, 5);
      }

      const answer = Math.pow(base, exp);
      const distractors = generateDistractors(answer, 3, Math.max(8, Math.floor(answer * 0.25)));

      return {
        id,
        operation,
        difficulty,
        questionText: `${base}<sup>${exp}</sup> = ?`,
        operatorSymbol: '^',
        correctAnswer: answer,
        options: shuffleArray([answer, ...distractors]),
        explanation: {
          fr: `${base} élevé à la puissance ${exp} = ${Array(exp).fill(base).join(' × ')} = ${answer}.`,
          en: `${base} to the power ${exp} = ${Array(exp).fill(base).join(' × ')} = ${answer}.`,
        },
        hint: {
          fr: `Multipliez ${base} par lui-même ${exp} fois.`,
          en: `Multiply ${base} by itself ${exp} times.`,
        },
      };
    }

    case 'fraction': {
      // Fraction addition scaled progressively by difficulty
      const denomRange =
        difficulty === 'beginner'
          ? [3, 5]
          : difficulty === 'easy'
          ? [4, 7]
          : difficulty === 'medium'
          ? [5, 10]
          : difficulty === 'hard'
          ? [7, 14]
          : [9 + extraStage, 18 + extraStage * 2];

      const denom = getRandomInt(denomRange[0], denomRange[1]);
      const num1 = getRandomInt(1, Math.max(1, denom - 2));
      const num2 = getRandomInt(1, Math.max(1, denom - num1));
      const sumNum = num1 + num2;

      const questionText = `${num1}/${denom} + ${num2}/${denom} = ?`;
      const correctAnswer = `${sumNum}/${denom}`;

      // Distractors
      const wrong1 = `${sumNum + 1}/${denom}`;
      const wrong2 = `${Math.max(1, sumNum - 1)}/${denom}`;
      const wrong3 = `${sumNum}/${denom + denom}`; // common student misconception!

      const rawOptions = [correctAnswer, wrong1, wrong2, wrong3];
      const uniqueOptions = Array.from(new Set(rawOptions));
      while (uniqueOptions.length < 4) {
        uniqueOptions.push(`${getRandomInt(1, denom + 2)}/${denom}`);
      }

      return {
        id,
        operation,
        difficulty,
        questionText,
        operatorSymbol: '/',
        correctAnswer,
        options: shuffleArray(uniqueOptions.slice(0, 4)),
        explanation: {
          fr: `Même dénominateur (${denom}) : on additionne simplement les numérateurs (${num1} + ${num2} = ${sumNum}), donc ${sumNum}/${denom}.`,
          en: `Same denominator (${denom}): just add the numerators (${num1} + ${num2} = ${sumNum}), so ${sumNum}/${denom}.`,
        },
      };
    }

    case 'equation': {
      // Progressive linear equations across all 5 levels
      if (difficulty === 'beginner') {
        const xVal = getRandomInt(1, 9);
        const a = getRandomInt(1, 9);
        const b = xVal + a;
        const distractors = generateDistractors(xVal, 3, 4);
        return {
          id,
          operation,
          difficulty,
          questionText: `x + ${a} = ${b}  ⟹  x = ?`,
          operatorSymbol: '=',
          correctAnswer: xVal,
          options: shuffleArray([xVal, ...distractors]),
          explanation: {
            fr: `Soustrayez ${a} des deux côtés : x = ${b} − ${a} = ${xVal}.`,
            en: `Subtract ${a} from both sides: x = ${b} − ${a} = ${xVal}.`,
          },
        };
      } else if (difficulty === 'easy') {
        const xVal = getRandomInt(5, 25);
        const a = getRandomInt(4, 18);
        const b = xVal + a;
        const distractors = generateDistractors(xVal, 3, 5);
        return {
          id,
          operation,
          difficulty,
          questionText: `x + ${a} = ${b}  ⟹  x = ?`,
          operatorSymbol: '=',
          correctAnswer: xVal,
          options: shuffleArray([xVal, ...distractors]),
          explanation: {
            fr: `Isolez x en soustrayant ${a} des deux côtés : x = ${b} − ${a} = ${xVal}.`,
            en: `Isolate x by subtracting ${a} from both sides: x = ${b} − ${a} = ${xVal}.`,
          },
        };
      } else if (difficulty === 'medium') {
        const xVal = getRandomInt(2, 12);
        const a = getRandomInt(2, 9);
        const b = a * xVal;
        const distractors = generateDistractors(xVal, 3, 4);
        return {
          id,
          operation,
          difficulty,
          questionText: `${a}x = ${b}  ⟹  x = ?`,
          operatorSymbol: '=',
          correctAnswer: xVal,
          options: shuffleArray([xVal, ...distractors]),
          explanation: {
            fr: `Pour trouver x, divisez ${b} par ${a} : x = ${b} / ${a} = ${xVal}.`,
            en: `To find x, divide ${b} by ${a}: x = ${b} / ${a} = ${xVal}.`,
          },
        };
      } else if (difficulty === 'hard') {
        const xVal = getRandomInt(2, 12);
        const a = getRandomInt(2, 7);
        const c = getRandomInt(2, 15);
        const b = a * xVal + c;
        const distractors = generateDistractors(xVal, 3, 5);
        return {
          id,
          operation,
          difficulty,
          questionText: `${a}x + ${c} = ${b}  ⟹  x = ?`,
          operatorSymbol: '=',
          correctAnswer: xVal,
          options: shuffleArray([xVal, ...distractors]),
          explanation: {
            fr: `${a}x = ${b} − ${c} = ${b - c}, donc x = ${b - c} / ${a} = ${xVal}.`,
            en: `${a}x = ${b} − ${c} = ${b - c}, so x = ${b - c} / ${a} = ${xVal}.`,
          },
        };
      } else {
        const xVal = getRandomInt(4 + extraStage, 18 + extraStage * 2);
        const a = getRandomInt(3, 11 + extraStage);
        const c = getRandomInt(5, 30 + extraStage * 5);
        const b = a * xVal - c;
        const distractors = generateDistractors(xVal, 3, 6);
        return {
          id,
          operation,
          difficulty,
          questionText: `${a}x − ${c} = ${b}  ⟹  x = ?`,
          operatorSymbol: '=',
          correctAnswer: xVal,
          options: shuffleArray([xVal, ...distractors]),
          explanation: {
            fr: `${a}x = ${b} + ${c} = ${b + c}, donc x = ${b + c} / ${a} = ${xVal}.`,
            en: `${a}x = ${b} + ${c} = ${b + c}, so x = ${b + c} / ${a} = ${xVal}.`,
          },
        };
      }
    }

    case 'geometry': {
      if (difficulty === 'beginner') {
        const side = getRandomInt(2, 12);
        const answer = 4 * side;
        const distractors = generateDistractors(answer, 3, 6);
        return {
          id,
          operation,
          difficulty,
          questionText: `Périmètre d’un carré de côté ${side} cm = ? (cm)`,
          operatorSymbol: '△',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `Le périmètre d’un carré est 4 × côté = 4 × ${side} = ${answer} cm.`,
            en: `The perimeter of a square is 4 × side = 4 × ${side} = ${answer} cm.`,
          },
          hint: {
            fr: 'Un carré possède 4 côtés égaux.',
            en: 'A square has 4 equal sides.',
          },
        };
      } else if (difficulty === 'easy') {
        const l = getRandomInt(4, 15);
        const w = getRandomInt(2, l);
        const answer = l * w;
        const distractors = generateDistractors(answer, 3, 10);
        return {
          id,
          operation,
          difficulty,
          questionText: `Aire d’un rectangle (${l} × ${w} cm) = ? (cm²)`,
          operatorSymbol: '△',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `Aire du rectangle = Longueur × largeur = ${l} × ${w} = ${answer} cm².`,
            en: `Rectangle area = length × width = ${l} × ${w} = ${answer} cm².`,
          },
          hint: {
            fr: 'Multipliez la longueur par la largeur.',
            en: 'Multiply length by width.',
          },
        };
      } else if (difficulty === 'medium') {
        const angle1 = getRandomInt(35, 80);
        const angle2 = getRandomInt(25, 130 - angle1);
        const answer = 180 - angle1 - angle2;
        const distractors = generateDistractors(answer, 3, 12);
        return {
          id,
          operation,
          difficulty,
          questionText: `Triangle : angles ${angle1}° et ${angle2}°. 3ᵉ angle = ? (°)`,
          operatorSymbol: '△',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `La somme des angles d’un triangle vaut toujours 180° : 180 − (${angle1} + ${angle2}) = ${answer}°.`,
            en: `Triangle angles always sum to 180°: 180 − (${angle1} + ${angle2}) = ${answer}°.`,
          },
          hint: {
            fr: 'La somme des 3 angles d’un triangle fait 180°.',
            en: 'The 3 angles of a triangle add up to 180°.',
          },
        };
      } else if (difficulty === 'hard') {
        const base = getRandomInt(4, 14) * 2;
        const height = getRandomInt(3, 14);
        const answer = (base * height) / 2;
        const distractors = generateDistractors(answer, 3, 12);
        return {
          id,
          operation,
          difficulty,
          questionText: `Aire d’un triangle (base ${base}, hauteur ${height}) = ?`,
          operatorSymbol: '△',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `Aire du triangle = (base × hauteur) ÷ 2 = (${base} × ${height}) ÷ 2 = ${answer}.`,
            en: `Triangle area = (base × height) ÷ 2 = (${base} × ${height}) ÷ 2 = ${answer}.`,
          },
          hint: {
            fr: 'N’oubliez pas de diviser par 2 après base × hauteur !',
            en: 'Remember to divide by 2 after base × height!',
          },
        };
      } else {
        const triples = [
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [9, 12, 15],
          [8, 15, 17],
        ];
        const [a, b, c] = triples[getRandomInt(0, triples.length - 1)];
        const answer = c;
        const distractors = generateDistractors(answer, 3, 5);
        return {
          id,
          operation,
          difficulty,
          questionText: `Triangle rectangle (${a} et ${b}) : hypoténuse = ?`,
          operatorSymbol: '△',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `Théorème de Pythagore : c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, donc c = √${c * c} = ${c}.`,
            en: `Pythagorean theorem: c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, so c = √${c * c} = ${c}.`,
          },
          hint: {
            fr: 'Utilisez Pythagore : a² + b² = c².',
            en: 'Use Pythagoras: a² + b² = c².',
          },
        };
      }
    }

    case 'functions': {
      if (difficulty === 'beginner') {
        const k = getRandomInt(2, 9);
        const x = getRandomInt(1, 10);
        const answer = k * x;
        const distractors = generateDistractors(answer, 3, 8);
        return {
          id,
          operation,
          difficulty,
          questionText: `f(x) = ${k}x  ⟹  f(${x}) = ?`,
          operatorSymbol: 'f',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `On remplace x par ${x} : f(${x}) = ${k} × ${x} = ${answer}.`,
            en: `Substitute x = ${x}: f(${x}) = ${k} × ${x} = ${answer}.`,
          },
          hint: {
            fr: `Remplacez x par ${x} dans l’expression.`,
            en: `Plug x = ${x} into the formula.`,
          },
        };
      } else if (difficulty === 'easy') {
        const a = getRandomInt(2, 6);
        const b = getRandomInt(1, 12);
        const x = getRandomInt(1, 9);
        const answer = a * x + b;
        const distractors = generateDistractors(answer, 3, 8);
        return {
          id,
          operation,
          difficulty,
          questionText: `f(x) = ${a}x + ${b}  ⟹  f(${x}) = ?`,
          operatorSymbol: 'f',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `f(${x}) = ${a} × ${x} + ${b} = ${a * x} + ${b} = ${answer}.`,
            en: `f(${x}) = ${a} × ${x} + ${b} = ${a * x} + ${b} = ${answer}.`,
          },
        };
      } else if (difficulty === 'medium') {
        const a = getRandomInt(2, 8);
        const b = getRandomInt(3, 15);
        const x = getRandomInt(2, 10);
        const answer = a * x - b;
        const distractors = generateDistractors(answer, 3, 10);
        return {
          id,
          operation,
          difficulty,
          questionText: `f(x) = ${a}x − ${b}  ⟹  f(${x}) = ?`,
          operatorSymbol: 'f',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `f(${x}) = ${a} × ${x} − ${b} = ${a * x} − ${b} = ${answer}.`,
            en: `f(${x}) = ${a} × ${x} − ${b} = ${a * x} − ${b} = ${answer}.`,
          },
        };
      } else if (difficulty === 'hard') {
        const c = getRandomInt(1, 15);
        const x = getRandomInt(2, 9);
        const answer = x * x + c;
        const distractors = generateDistractors(answer, 3, 12);
        return {
          id,
          operation,
          difficulty,
          questionText: `g(x) = x<sup>2</sup> + ${c}  ⟹  g(${x}) = ?`,
          operatorSymbol: 'f',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `g(${x}) = ${x}² + ${c} = ${x * x} + ${c} = ${answer}.`,
            en: `g(${x}) = ${x}² + ${c} = ${x * x} + ${c} = ${answer}.`,
          },
          hint: {
            fr: `Calculez d’abord ${x}², puis ajoutez ${c}.`,
            en: `Compute ${x}² first, then add ${c}.`,
          },
        };
      } else {
        // Antecedent of affine function
        const a = getRandomInt(2, 7 + extraStage);
        const b = getRandomInt(2, 15);
        const xVal = getRandomInt(2, 12 + extraStage);
        const y = a * xVal + b;
        const distractors = generateDistractors(xVal, 3, 5);
        return {
          id,
          operation,
          difficulty,
          questionText: `f(x) = ${a}x + ${b}, f(x) = ${y}  ⟹  x = ?`,
          operatorSymbol: 'f',
          correctAnswer: xVal,
          options: shuffleArray([xVal, ...distractors]),
          explanation: {
            fr: `On résout ${a}x + ${b} = ${y} : ${a}x = ${y - b}, donc l’antécédent vaut x = ${xVal}.`,
            en: `Solve ${a}x + ${b} = ${y}: ${a}x = ${y - b}, so x = ${xVal}.`,
          },
        };
      }
    }

    case 'statistics': {
      if (difficulty === 'beginner' || difficulty === 'easy') {
        const count = difficulty === 'beginner' ? 3 : 4;
        const mean = getRandomInt(4, difficulty === 'beginner' ? 12 : 20);
        const nums: number[] = [];
        let running = 0;
        for (let i = 0; i < count - 1; i++) {
          const val = getRandomInt(Math.max(1, mean - 5), mean + 5);
          nums.push(val);
          running += val;
        }
        const last = mean * count - running;
        if (last >= 0) {
          nums.push(last);
        } else {
          // Safe fallback guaranteed positive
          const a = mean - 2;
          const b = mean;
          const c = mean + 2;
          const fallbackMean = mean;
          const distractors = generateDistractors(fallbackMean, 3, 5);
          return {
            id,
            operation,
            difficulty,
            questionText: `Moyenne de [${a}, ${b}, ${c}] = ?`,
            operatorSymbol: 'μ',
            correctAnswer: fallbackMean,
            options: shuffleArray([fallbackMean, ...distractors]),
            explanation: {
              fr: `Moyenne = (${a} + ${b} + ${c}) ÷ 3 = ${a + b + c} ÷ 3 = ${fallbackMean}.`,
              en: `Mean = (${a} + ${b} + ${c}) ÷ 3 = ${a + b + c} ÷ 3 = ${fallbackMean}.`,
            },
          };
        }
        const sum = nums.reduce((acc, v) => acc + v, 0);
        const distractors = generateDistractors(mean, 3, 6);
        return {
          id,
          operation,
          difficulty,
          questionText: `Moyenne de [${nums.join(', ')}] = ?`,
          operatorSymbol: 'μ',
          correctAnswer: mean,
          options: shuffleArray([mean, ...distractors]),
          explanation: {
            fr: `On additionne toutes les valeurs (${sum}) puis on divise par l’effectif (${count}) : ${sum} ÷ ${count} = ${mean}.`,
            en: `Sum all values (${sum}) and divide by count (${count}): ${sum} ÷ ${count} = ${mean}.`,
          },
          hint: {
            fr: 'Moyenne = somme des valeurs ÷ nombre de valeurs.',
            en: 'Mean = sum of values ÷ number of values.',
          },
        };
      } else if (difficulty === 'medium') {
        const sorted = [
          getRandomInt(2, 8),
          getRandomInt(9, 14),
          getRandomInt(15, 22),
          getRandomInt(23, 30),
          getRandomInt(31, 40),
        ];
        const answer = sorted[2];
        const distractors = generateDistractors(answer, 3, 6);
        return {
          id,
          operation,
          difficulty,
          questionText: `Médiane de [${sorted.join(', ')}] = ?`,
          operatorSymbol: 'Me',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `La série est ordonnée et compte 5 valeurs : la valeur centrale (3ᵉ position) est ${answer}.`,
            en: `The ordered list has 5 values: the middle value (3rd position) is ${answer}.`,
          },
          hint: {
            fr: 'Trouvez la valeur exactement au milieu de la série ordonnée.',
            en: 'Find the exact middle value of the sorted list.',
          },
        };
      } else if (difficulty === 'hard') {
        const minVal = getRandomInt(4, 15);
        const maxVal = getRandomInt(minVal + 12, minVal + 45);
        const mid1 = getRandomInt(minVal + 2, maxVal - 4);
        const mid2 = getRandomInt(minVal + 3, maxVal - 2);
        const series = shuffleArray([minVal, mid1, mid2, maxVal]);
        const answer = maxVal - minVal;
        const distractors = generateDistractors(answer, 3, 8);
        return {
          id,
          operation,
          difficulty,
          questionText: `Étendue de [${series.join(', ')}] = ?`,
          operatorSymbol: 'E',
          correctAnswer: answer,
          options: shuffleArray([answer, ...distractors]),
          explanation: {
            fr: `Étendue = Valeur maximale − Valeur minimale = ${maxVal} − ${minVal} = ${answer}.`,
            en: `Range = Max − Min = ${maxVal} − ${minVal} = ${answer}.`,
          },
          hint: {
            fr: 'Soustrayez la plus petite valeur à la plus grande.',
            en: 'Subtract the smallest value from the largest.',
          },
        };
      } else {
        const base = getRandomInt(10, 22);
        const v1 = base - 4;
        const v2 = base - 2;
        const v3 = base;
        const v4 = base + 2;
        const v5 = base + 4 + extraStage * 5;
        const sum = v1 + v2 + v3 + v4 + v5;
        const exactMean = Math.round(sum / 5);
        const adjustedV5 = exactMean * 5 - (v1 + v2 + v3 + v4);
        const list = [v1, v2, v3, v4, adjustedV5];
        const total = list.reduce((a, b) => a + b, 0);
        const distractors = generateDistractors(exactMean, 3, 6);
        return {
          id,
          operation,
          difficulty,
          questionText: `Moyenne de [${list.join(', ')}] = ?`,
          operatorSymbol: 'μ',
          correctAnswer: exactMean,
          options: shuffleArray([exactMean, ...distractors]),
          explanation: {
            fr: `Moyenne = ${total} ÷ 5 = ${exactMean}.`,
            en: `Mean = ${total} ÷ 5 = ${exactMean}.`,
          },
        };
      }
    }

    case 'probability': {
      const scenarios: {
        difficulty: DifficultyLevel[];
        q: string;
        ans: string;
        wrongs: string[];
        frExp: string;
        enExp: string;
      }[] = [
        {
          difficulty: ['beginner', 'easy'],
          q: 'Pièce équilibrée : P(Pile) = ?',
          ans: '1/2',
          wrongs: ['1/4', '1/3', '2/3'],
          frExp: 'Il y a 1 face Pile sur 2 faces possibles : P = 1/2.',
          enExp: 'There is 1 favorable side out of 2 possible outcomes: P = 1/2.',
        },
        {
          difficulty: ['beginner', 'easy'],
          q: 'Dé à 6 faces : P(obtenir 4) = ?',
          ans: '1/6',
          wrongs: ['1/3', '1/4', '2/6'],
          frExp: 'Un seul 4 sur 6 faces équiprobables : P = 1/6.',
          enExp: 'Only one 4 out of 6 equal faces: P = 1/6.',
        },
        {
          difficulty: ['easy', 'medium'],
          q: 'Dé à 6 faces : P(nombre pair) = ?',
          ans: '1/2',
          wrongs: ['1/6', '1/3', '2/3'],
          frExp: 'Les nombres pairs sont {2, 4, 6}, soit 3 chances sur 6 = 3/6 = 1/2.',
          enExp: 'Even numbers are {2, 4, 6}, so 3 out of 6 = 3/6 = 1/2.',
        },
        {
          difficulty: ['medium', 'hard'],
          q: 'Urne : 3 boules rouges, 7 bleues. P(rouge) = ?',
          ans: '3/10',
          wrongs: ['3/7', '7/10', '1/3'],
          frExp: 'Total = 3 + 7 = 10 boules. Il y a 3 boules rouges : P = 3/10.',
          enExp: 'Total = 3 + 7 = 10 balls. 3 are red: P = 3/10.',
        },
        {
          difficulty: ['medium', 'hard'],
          q: 'Dé à 6 faces : P(obtenir > 4) = ?',
          ans: '1/3',
          wrongs: ['1/6', '1/2', '2/3'],
          frExp: 'Les faces > 4 sont {5, 6}, soit 2/6 = 1/3.',
          enExp: 'Faces > 4 are {5, 6}, which is 2/6 = 1/3.',
        },
        {
          difficulty: ['hard', 'expert'],
          q: 'Si P(A) = 2/5, alors P(contraire de A) = ?',
          ans: '3/5',
          wrongs: ['2/5', '1/5', '4/5'],
          frExp: 'L’événement contraire vaut 1 − P(A) = 5/5 − 2/5 = 3/5.',
          enExp: 'The complementary event is 1 − P(A) = 5/5 − 2/5 = 3/5.',
        },
        {
          difficulty: ['expert'],
          q: 'Deux lancers de pièce : P(2 fois Pile) = ?',
          ans: '1/4',
          wrongs: ['1/2', '1/3', '3/4'],
          frExp: 'Issues : (P,P), (P,F), (F,P), (F,F). Une seule donne 2 fois Pile : P = 1/4.',
          enExp: 'Outcomes: (H,H), (H,T), (T,H), (T,T). Only 1 has two Heads: P = 1/4.',
        },
      ];

      const pool = scenarios.filter((s) => s.difficulty.includes(difficulty));
      const picked = pool[getRandomInt(0, pool.length - 1)] || scenarios[0];

      return {
        id,
        operation,
        difficulty,
        questionText: picked.q,
        operatorSymbol: 'P',
        correctAnswer: picked.ans,
        options: shuffleArray([picked.ans, ...picked.wrongs]),
        explanation: {
          fr: picked.frExp,
          en: picked.enExp,
        },
        hint: {
          fr: 'Probabilité = nombre de cas favorables ÷ nombre total de cas possibles.',
          en: 'Probability = favorable outcomes ÷ total possible outcomes.',
        },
      };
    }
  }
}
