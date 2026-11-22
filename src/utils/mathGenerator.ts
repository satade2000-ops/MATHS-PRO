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
  }
}
