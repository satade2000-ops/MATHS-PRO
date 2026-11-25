import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  BookOpen,
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { OperationType } from '../types/math';
import { sound } from '../utils/audio';

interface LessonModule {
  id: string;
  operation: OperationType;
  symbol: string;
  gradient: string;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  summary: { fr: string; en: string };
  formulas: { fr: string[]; en: string[] };
  exampleTitle: { fr: string; en: string };
  exampleSteps: { fr: string[]; en: string[] };
  pitfall: { fr: string; en: string };
  miniQuiz: {
    question: { fr: string; en: string };
    options: string[];
    correct: string;
    explanation: { fr: string; en: string };
  };
}

const LESSONS: LessonModule[] = [
  {
    id: 'arithmetic',
    operation: 'mental_math',
    symbol: '+−×÷',
    gradient: 'from-blue-600 to-indigo-600',
    title: { fr: 'Arithmétique & Calcul Mental', en: 'Arithmetic & Mental Math' },
    subtitle: { fr: 'Opérations, priorités opératoires et astuces', en: 'Operations, order of precedence, and shortcuts' },
    summary: {
      fr: "L'arithmétique regroupe les quatre opérations fondamentales (+, −, ×, ÷) et l'ordre strict dans lequel elles doivent être effectuées. Maîtriser la décomposition en dizaines et unités permet de calculer rapidement de tête sans erreur de retenue.",
      en: 'Arithmetic covers the four core operations (+, −, ×, ÷) and the exact order in which expressions are evaluated. Breaking numbers into tens and units enables fast, accurate mental calculation.',
    },
    formulas: {
      fr: [
        'Priorités (PEMDAS) : Parenthèses ➔ Puissances ➔ × et ÷ (de gauche à droite) ➔ + et −',
        'Distributivité : a × (b + c) = a × b + a × c (ex. 14 × 12 = 14 × 10 + 14 × 2)',
        'Vérification soustraction : a − b = c ⇔ c + b = a',
      ],
      en: [
        'Order of operations (PEMDAS): Parentheses ➔ Exponents ➔ × & ÷ (left to right) ➔ + & −',
        'Distributive law: a × (b + c) = a × b + a × c (e.g. 14 × 12 = 14 × 10 + 14 × 2)',
        'Subtraction check: a − b = c ⇔ c + b = a',
      ],
    },
    exampleTitle: {
      fr: 'Calculer rapidement : 8 + 5 × (12 − 4)',
      en: 'Solve step by step: 8 + 5 × (12 − 4)',
    },
    exampleSteps: {
      fr: [
        '1. On calcule d’abord l’intérieur des parenthèses : 12 − 4 = 8.',
        '2. On effectue ensuite la multiplication (prioritaire sur l’addition) : 5 × 8 = 40.',
        '3. On termine par l’addition : 8 + 40 = 48.',
      ],
      en: [
        '1. Evaluate inside parentheses first: 12 − 4 = 8.',
        '2. Perform multiplication before addition: 5 × 8 = 40.',
        '3. Finish with addition: 8 + 40 = 48.',
      ],
    },
    pitfall: {
      fr: 'Ne jamais additionner de gauche à droite avant de multiplier : 8 + 5 × 8 ne vaut pas 13 × 8 !',
      en: 'Never add left-to-right before multiplying: 8 + 5 × 8 is NOT 13 × 8!',
    },
    miniQuiz: {
      question: { fr: 'Combien vaut 6 + 4 × 5 ?', en: 'What is 6 + 4 × 5?' },
      options: ['50', '26', '24', '30'],
      correct: '26',
      explanation: {
        fr: 'La multiplication est prioritaire : 4 × 5 = 20, puis 6 + 20 = 26.',
        en: 'Multiplication comes first: 4 × 5 = 20, then 6 + 20 = 26.',
      },
    },
  },
  {
    id: 'algebra',
    operation: 'power',
    symbol: 'aⁿ',
    gradient: 'from-violet-600 to-purple-700',
    title: { fr: 'Algèbre, Puissances & Racines', en: 'Algebra, Powers & Roots' },
    subtitle: { fr: 'Calcul littéral, exposants et racines carrées', en: 'Algebraic expressions, exponents, and square roots' },
    summary: {
      fr: "L'algèbre utilise des lettres (x, y, a) pour représenter des nombres quelconques et généraliser des relations. Les puissances traduisent des multiplications répétées d'un même facteur, tandis que la racine carrée effectue l'opération inverse du carré.",
      en: 'Algebra uses letters (x, y, a) to represent numbers and generalize mathematical relationships. Powers express repeated multiplication, while square roots undo squaring.',
    },
    formulas: {
      fr: [
        'Produit de puissances : aᵐ × aⁿ = aᵐ⁺ⁿ et a⁰ = 1 (pour a ≠ 0)',
        'Identité remarquable : (a + b)² = a² + 2ab + b²',
        'Racine carrée : √(a²) = a (pour a ≥ 0), par exemple √144 = 12 car 12² = 144',
      ],
      en: [
        'Product rule: aᵐ × aⁿ = aᵐ⁺ⁿ and a⁰ = 1 (for a ≠ 0)',
        'Square of sum: (a + b)² = a² + 2ab + b²',
        'Square root: √(a²) = a (for a ≥ 0), e.g., √144 = 12 because 12² = 144',
      ],
    },
    exampleTitle: {
      fr: 'Simplifier et calculer : 2⁴ + √49',
      en: 'Simplify and compute: 2⁴ + √49',
    },
    exampleSteps: {
      fr: [
        '1. 2⁴ signifie 2 multiplié par lui-même 4 fois : 2 × 2 × 2 × 2 = 16.',
        '2. √49 est le nombre positif dont le carré vaut 49 : 7 × 7 = 49, donc √49 = 7.',
        '3. On additionne les deux résultats : 16 + 7 = 23.',
      ],
      en: [
        '1. 2⁴ means 2 multiplied by itself 4 times: 2 × 2 × 2 × 2 = 16.',
        '2. √49 is the positive number whose square is 49: 7 × 7 = 49, so √49 = 7.',
        '3. Add both results: 16 + 7 = 23.',
      ],
    },
    pitfall: {
      fr: 'Attention : 3⁴ vaut 3 × 3 × 3 × 3 = 81, et surtout pas 3 × 4 = 12 !',
      en: 'Watch out: 3⁴ equals 3 × 3 × 3 × 3 = 81, NOT 3 × 4 = 12!',
    },
    miniQuiz: {
      question: { fr: 'Quelle est la valeur de 3³ − √16 ?', en: 'What is the value of 3³ − √16?' },
      options: ['5', '23', '19', '11'],
      correct: '23',
      explanation: {
        fr: '3³ = 3 × 3 × 3 = 27 et √16 = 4. Donc 27 − 4 = 23.',
        en: '3³ = 3 × 3 × 3 = 27 and √16 = 4. So 27 − 4 = 23.',
      },
    },
  },
  {
    id: 'geometry',
    operation: 'geometry',
    symbol: '△',
    gradient: 'from-emerald-600 to-cyan-600',
    title: { fr: 'Géométrie Plane & Pythagore', en: 'Plane Geometry & Pythagoras' },
    subtitle: { fr: 'Périmètres, aires, angles et triangles rectangles', en: 'Perimeters, areas, angles, and right triangles' },
    summary: {
      fr: 'La géométrie étudie les figures dans le plan et dans l’espace : mesures de contours (périmètre), de surfaces (aire), somme des angles dans un triangle et relations métriques comme le célèbre théorème de Pythagore.',
      en: 'Geometry studies shapes and spatial properties: boundary length (perimeter), surface size (area), angle sums in triangles, and the Pythagorean theorem for right triangles.',
    },
    formulas: {
      fr: [
        'Carré (côté c) : Périmètre = 4 × c · Aire = c²',
        'Rectangle (L × l) : Périmètre = 2 × (L + l) · Aire = L × l',
        'Triangle : Somme des 3 angles = 180° · Aire = (base × hauteur) ÷ 2',
        'Pythagore (triangle rectangle) : hypoténuse² = côté₁² + côté₂²',
      ],
      en: [
        'Square (side s): Perimeter = 4 × s · Area = s²',
        'Rectangle (L × w): Perimeter = 2 × (L + w) · Area = L × w',
        'Triangle: Angles sum to 180° · Area = (base × height) ÷ 2',
        'Pythagoras (right triangle): hypotenuse² = side₁² + side₂²',
      ],
    },
    exampleTitle: {
      fr: 'Triangle rectangle de côtés 6 cm et 8 cm : trouver l’hypoténuse',
      en: 'Right triangle with legs 6 cm and 8 cm: find the hypotenuse',
    },
    exampleSteps: {
      fr: [
        '1. On applique le théorème de Pythagore : c² = 6² + 8².',
        '2. On calcule les carrés : c² = 36 + 64 = 100.',
        '3. On prend la racine carrée : c = √100 = 10 cm.',
      ],
      en: [
        '1. Apply the Pythagorean theorem: c² = 6² + 8².',
        '2. Compute the squares: c² = 36 + 64 = 100.',
        '3. Take the square root: c = √100 = 10 cm.',
      ],
    },
    pitfall: {
      fr: 'Pour l’aire d’un triangle, ne jamais oublier de diviser (base × hauteur) par 2 !',
      en: 'For triangle area, never forget to divide (base × height) by 2!',
    },
    miniQuiz: {
      question: {
        fr: 'Un triangle possède deux angles de 50° et 65°. Combien mesure le 3ᵉ angle ?',
        en: 'A triangle has two angles measuring 50° and 65°. What is the 3rd angle?',
      },
      options: ['55°', '65°', '75°', '45°'],
      correct: '65°',
      explanation: {
        fr: 'La somme vaut 180°. Donc 180 − (50 + 65) = 180 − 115 = 65°.',
        en: 'The angle sum is 180°. So 180 − (50 + 65) = 180 − 115 = 65°.',
      },
    },
  },
  {
    id: 'fractions',
    operation: 'fraction',
    symbol: '½',
    gradient: 'from-orange-500 to-amber-600',
    title: { fr: 'Fractions & Proportions', en: 'Fractions & Ratios' },
    subtitle: { fr: 'Numérateur, dénominateur, addition et simplification', en: 'Numerator, denominator, addition, and simplifying' },
    summary: {
      fr: 'Une fraction a/b représente une part d’une unité découpée en b parts égales (dénominateur, jamais égal à 0), dont on retient a parts (numérateur). Pour additionner ou soustraire deux fractions, elles doivent d’abord partager le même dénominateur.',
      en: 'A fraction a/b represents taking a equal parts (numerator) out of b total parts (denominator, never zero). To add or subtract fractions, they must share a common denominator.',
    },
    formulas: {
      fr: [
        'Même dénominateur : a/c + b/c = (a + b)/c',
        'Dénominateurs différents : a/b + c/d = (a×d + b×c) / (b×d)',
        'Simplification : (k × a) / (k × b) = a / b (avec k ≠ 0)',
      ],
      en: [
        'Like denominators: a/c + b/c = (a + b)/c',
        'Unlike denominators: a/b + c/d = (a×d + b×c) / (b×d)',
        'Simplifying: (k × a) / (k × b) = a / b (for k ≠ 0)',
      ],
    },
    exampleTitle: {
      fr: 'Additionner puis simplifier : 3/8 + 1/8',
      en: 'Add and simplify: 3/8 + 1/8',
    },
    exampleSteps: {
      fr: [
        '1. Les deux fractions ont déjà le même dénominateur (8).',
        '2. On additionne uniquement les numérateurs : (3 + 1)/8 = 4/8.',
        '3. On simplifie numérateur et dénominateur par 4 : 4/8 = 1/2.',
      ],
      en: [
        '1. Both fractions already share denominator 8.',
        '2. Add only the numerators: (3 + 1)/8 = 4/8.',
        '3. Divide top and bottom by 4: 4/8 = 1/2.',
      ],
    },
    pitfall: {
      fr: 'Erreur classique : ne jamais additionner les dénominateurs entre eux ! 3/8 + 1/8 ≠ 4/16.',
      en: 'Classic mistake: never add denominators together! 3/8 + 1/8 ≠ 4/16.',
    },
    miniQuiz: {
      question: { fr: 'Combien fait 2/7 + 3/7 ?', en: 'What is 2/7 + 3/7?' },
      options: ['5/14', '5/7', '6/7', '1/7'],
      correct: '5/7',
      explanation: {
        fr: 'On conserve le dénominateur 7 et on additionne 2 + 3 = 5, soit 5/7.',
        en: 'Keep denominator 7 and add 2 + 3 = 5, giving 5/7.',
      },
    },
  },
  {
    id: 'equations',
    operation: 'equation',
    symbol: 'x=',
    gradient: 'from-cyan-600 to-blue-600',
    title: { fr: 'Équations du 1er Degré', en: 'Linear Equations' },
    subtitle: { fr: 'Méthode de la balance et résolution pas à pas', en: 'Balance method and step-by-step solving' },
    summary: {
      fr: 'Une équation est une égalité comportant une inconnue (souvent x). Résoudre l’équation consiste à trouver la valeur de x qui rend l’égalité vraie, en appliquant exactement la même opération des deux côtés du signe « = ».',
      en: 'An equation states equality between two expressions containing an unknown (usually x). Solving means finding x by applying identical inverse operations to both sides.',
    },
    formulas: {
      fr: [
        'x + a = b  ⟹  x = b − a',
        'a × x = b (avec a ≠ 0)  ⟹  x = b ÷ a',
        'a × x + c = b  ⟹  a × x = b − c  ⟹  x = (b − c) ÷ a',
      ],
      en: [
        'x + a = b  ⟹  x = b − a',
        'a × x = b (with a ≠ 0)  ⟹  x = b ÷ a',
        'a × x + c = b  ⟹  a × x = b − c  ⟹  x = (b − c) ÷ a',
      ],
    },
    exampleTitle: {
      fr: 'Résoudre : 4x − 5 = 19',
      en: 'Solve: 4x − 5 = 19',
    },
    exampleSteps: {
      fr: [
        '1. On isole le terme en x en ajoutant 5 des deux côtés : 4x = 19 + 5 = 24.',
        '2. On divise les deux membres par 4 : x = 24 ÷ 4 = 6.',
        '3. Vérification : 4 × 6 − 5 = 24 − 5 = 19 (exact !).',
      ],
      en: [
        '1. Add 5 to both sides to isolate the x term: 4x = 19 + 5 = 24.',
        '2. Divide both sides by 4: x = 24 ÷ 4 = 6.',
        '3. Check: 4 × 6 − 5 = 24 − 5 = 19 (correct!).',
      ],
    },
    pitfall: {
      fr: 'Quand un terme passe de l’autre côté du « = », son opération s’inverse (+ devient −, × devient ÷).',
      en: 'Moving a term across "=" inverts its operation (+ becomes −, × becomes ÷).',
    },
    miniQuiz: {
      question: { fr: 'Si 3x + 4 = 25, combien vaut x ?', en: 'If 3x + 4 = 25, what is x?' },
      options: ['5', '7', '8', '9'],
      correct: '7',
      explanation: {
        fr: '3x = 25 − 4 = 21, donc x = 21 ÷ 3 = 7.',
        en: '3x = 25 − 4 = 21, so x = 21 ÷ 3 = 7.',
      },
    },
  },
  {
    id: 'functions',
    operation: 'functions',
    symbol: 'f(x)',
    gradient: 'from-indigo-600 to-violet-600',
    title: { fr: 'Fonctions Mathématiques', en: 'Mathematical Functions' },
    subtitle: { fr: 'Images, antécédents, fonctions linéaires et affines', en: 'Inputs, outputs, linear and affine functions' },
    summary: {
      fr: 'Une fonction f associe à chaque nombre de départ x un unique nombre d’arrivée f(x), appelé l’image de x. Inversement, trouver un antécédent revient à chercher quel x produit une image donnée.',
      en: 'A function f maps each input value x to a unique output value f(x). Finding an input (preimage) means solving f(x) = y for x.',
    },
    formulas: {
      fr: [
        'Fonction linéaire : f(x) = a × x (droite passant par l’origine, proportionnalité)',
        'Fonction affine : f(x) = a × x + b (coefficient directeur a, ordonnée à l’origine b)',
        'Image de k : on remplace x par k dans l’expression de f(x)',
      ],
      en: [
        'Linear function: f(x) = a × x (straight line through origin)',
        'Affine function: f(x) = a × x + b (slope a, y-intercept b)',
        'Output at k: substitute x = k into the formula for f(x)',
      ],
    },
    exampleTitle: {
      fr: 'Soit f(x) = 3x − 2 : calculer f(5) puis l’antécédent de 13',
      en: 'Given f(x) = 3x − 2: find f(5) and the x where f(x) = 13',
    },
    exampleSteps: {
      fr: [
        '1. Image de 5 : f(5) = 3 × 5 − 2 = 15 − 2 = 13.',
        '2. Antécédent de 13 : on résout 3x − 2 = 13 ➔ 3x = 15 ➔ x = 5.',
        '3. 13 est donc l’image de 5, et 5 est l’antécédent de 13.',
      ],
      en: [
        '1. Output at 5: f(5) = 3 × 5 − 2 = 15 − 2 = 13.',
        '2. Input for 13: solve 3x − 2 = 13 ➔ 3x = 15 ➔ x = 5.',
        '3. Thus 13 is the image of 5, and 5 maps to 13.',
      ],
    },
    pitfall: {
      fr: 'Ne pas confondre image et antécédent : calculer f(4) donne l’image, résoudre f(x) = 4 donne l’antécédent.',
      en: 'Do not mix up image and preimage: evaluating f(4) gives the output; solving f(x) = 4 gives the input.',
    },
    miniQuiz: {
      question: { fr: 'Si g(x) = 2x + 7, que vaut g(4) ?', en: 'If g(x) = 2x + 7, what is g(4)?' },
      options: ['13', '15', '11', '18'],
      correct: '15',
      explanation: {
        fr: 'On remplace x par 4 : g(4) = 2 × 4 + 7 = 8 + 7 = 15.',
        en: 'Substitute x = 4: g(4) = 2 × 4 + 7 = 8 + 7 = 15.',
      },
    },
  },
  {
    id: 'statistics',
    operation: 'statistics',
    symbol: '📊',
    gradient: 'from-sky-500 to-indigo-600',
    title: { fr: 'Statistiques Descriptives', en: 'Descriptive Statistics' },
    subtitle: { fr: 'Moyenne, médiane, étendue et lecture de séries', en: 'Mean, median, range, and data interpretation' },
    summary: {
      fr: 'Les statistiques permettent de résumer et d’analyser des séries de données numériques grâce à des indicateurs de position (moyenne, médiane) et de dispersion (étendue).',
      en: 'Statistics summarizes numerical datasets using measures of center (mean, median) and spread (range).',
    },
    formulas: {
      fr: [
        'Moyenne : (somme de toutes les valeurs) ÷ (nombre total de valeurs)',
        'Médiane : valeur centrale une fois la série rangée par ordre croissant',
        'Étendue : Valeur maximale − Valeur minimale',
      ],
      en: [
        'Mean: (sum of all values) ÷ (total number of values)',
        'Median: middle value after sorting the dataset in ascending order',
        'Range: Maximum value − Minimum value',
      ],
    },
    exampleTitle: {
      fr: 'Analyser la série de notes : [14, 8, 12, 18, 8]',
      en: 'Analyze the score set: [14, 8, 12, 18, 8]',
    },
    exampleSteps: {
      fr: [
        '1. Moyenne : (14 + 8 + 12 + 18 + 8) ÷ 5 = 60 ÷ 5 = 12.',
        '2. Médiane : on trie d’abord [8, 8, 12, 14, 18] ➔ la valeur centrale est 12.',
        '3. Étendue : Max − Min = 18 − 8 = 10.',
      ],
      en: [
        '1. Mean: (14 + 8 + 12 + 18 + 8) ÷ 5 = 60 ÷ 5 = 12.',
        '2. Median: sort first [8, 8, 12, 14, 18] ➔ the middle value is 12.',
        '3. Range: Max − Min = 18 − 8 = 10.',
      ],
    },
    pitfall: {
      fr: 'Pour trouver la médiane, il faut TOUJOURS ranger la série dans l’ordre croissant avant de prendre le milieu.',
      en: 'To find the median, ALWAYS sort the numbers in ascending order before picking the middle.',
    },
    miniQuiz: {
      question: {
        fr: 'Quelle est la moyenne des nombres [10, 14, 18] ?',
        en: 'What is the mean of [10, 14, 18]?',
      },
      options: ['12', '14', '15', '16'],
      correct: '14',
      explanation: {
        fr: '(10 + 14 + 18) ÷ 3 = 42 ÷ 3 = 14.',
        en: '(10 + 14 + 18) ÷ 3 = 42 ÷ 3 = 14.',
      },
    },
  },
  {
    id: 'probability',
    operation: 'probability',
    symbol: '🎲',
    gradient: 'from-fuchsia-500 to-purple-600',
    title: { fr: 'Probabilités', en: 'Probability' },
    subtitle: { fr: 'Issues possibles, loi de Laplace et événement contraire', en: 'Outcomes, equiprobability, and complements' },
    summary: {
      fr: 'Les probabilités mesurent la chance qu’un événement se produise, sur une échelle comprise entre 0 (impossible) et 1 (certain). Lorsque toutes les issues ont la même chance de sortir, on applique la formule de Laplace.',
      en: 'Probability measures how likely an event is on a scale from 0 (impossible) to 1 (certain). When all outcomes are equally likely, probability equals favorable cases divided by total cases.',
    },
    formulas: {
      fr: [
        'Équiprobabilité : P(A) = (nombre d’issues favorables) ÷ (nombre total d’issues)',
        'Encadrement : 0 ≤ P(A) ≤ 1 (ou entre 0 % et 100 %)',
        'Événement contraire : P(non A) = 1 − P(A)',
      ],
      en: [
        'Equally likely outcomes: P(A) = (favorable outcomes) ÷ (total outcomes)',
        'Bounds: 0 ≤ P(A) ≤ 1 (or 0% to 100%)',
        'Complement rule: P(not A) = 1 − P(A)',
      ],
    },
    exampleTitle: {
      fr: 'Un sac contient 4 billes vertes et 6 billes bleues : calculer P(verte)',
      en: 'A bag has 4 green and 6 blue marbles: find P(green)',
    },
    exampleSteps: {
      fr: [
        '1. Nombre total d’issues : 4 + 6 = 10 billes.',
        '2. Issues favorables : 4 billes vertes.',
        '3. Probabilité : P(verte) = 4/10 = 2/5 (soit 40 %), et P(bleue) = 1 − 2/5 = 3/5.',
      ],
      en: [
        '1. Total outcomes: 4 + 6 = 10 marbles.',
        '2. Favorable outcomes: 4 green marbles.',
        '3. Probability: P(green) = 4/10 = 2/5 (40%), and P(blue) = 1 − 2/5 = 3/5.',
      ],
    },
    pitfall: {
      fr: 'Dans « 4 vertes et 6 bleues », le dénominateur est le total (4 + 6 = 10), pas 6 !',
      en: 'With "4 green and 6 blue", the denominator is the total (4 + 6 = 10), not 6!',
    },
    miniQuiz: {
      question: {
        fr: 'Sur un dé équilibré à 6 faces, quelle est la probabilité d’obtenir un 5 ou un 6 ?',
        en: 'On a fair 6-sided die, what is the probability of rolling a 5 or 6?',
      },
      options: ['1/6', '1/3', '1/2', '2/3'],
      correct: '1/3',
      explanation: {
        fr: 'Il y a 2 issues favorables ({5, 6}) sur 6 possibles : 2/6 = 1/3.',
        en: 'There are 2 favorable outcomes ({5, 6}) out of 6 total: 2/6 = 1/3.',
      },
    },
  },
];

export const LessonsPage: React.FC = () => {
  const { settings, goHome, startNewGame } = useMathApp();
  const isFr = settings.language === 'fr';
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const activeLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];
  const selectedQuizChoice = quizAnswers[activeLesson.id];
  const isQuizAnswered = Boolean(selectedQuizChoice);
  const isQuizCorrect = selectedQuizChoice === activeLesson.miniQuiz.correct;

  const handleBackHome = () => {
    sound.playClick();
    goHome();
  };

  const handleQuizOption = (option: string) => {
    if (isQuizAnswered) return;
    if (option === activeLesson.miniQuiz.correct) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
    setQuizAnswers((prev) => ({ ...prev, [activeLesson.id]: option }));
  };

  const handleLaunchPractice = (op: OperationType) => {
    sound.playClick();
    startNewGame(op, 'learning', settings.selectedDifficulty);
  };

  return (
    <div className="space-y-5 pb-6 animate-fadeIn select-text">
      {/* Top Return Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
        </button>

        <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
          {isFr ? '8 chapitres complets' : '8 full chapters'}
        </span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 text-white p-6 shadow-xl shadow-teal-500/15 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
              {isFr ? 'Bibliothèque Pédagogique' : 'Study Library'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-0.5">
              {isFr ? 'Cours & Fiches Méthode' : 'Math Lessons & Study Guides'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50/90 mt-1.5 leading-relaxed">
              {isFr
                ? 'Révise les formules essentielles, suis nos exemples résolus pas à pas et lance des exercices corrigés sur chaque thème.'
                : 'Review key formulas, follow step-by-step worked examples, and launch interactive practice quizzes on every topic.'}
            </p>
          </div>
        </div>
      </div>

      {/* Chapter Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {LESSONS.map((lesson) => {
          const isSelected = lesson.id === activeLesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                sound.playClick();
                setSelectedLessonId(lesson.id);
              }}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-97 flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center px-2 py-1 rounded-lg font-mono text-xs font-black w-fit ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : `bg-gradient-to-tr ${lesson.gradient} text-white`
                }`}
              >
                {lesson.symbol}
              </span>
              <span className="text-xs font-extrabold leading-tight line-clamp-2">
                {isFr ? lesson.title.fr : lesson.title.en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Lesson Content Card */}
      <article className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
        {/* Title & Practice CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {isFr ? activeLesson.subtitle.fr : activeLesson.subtitle.en}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
              {isFr ? activeLesson.title.fr : activeLesson.title.en}
            </h2>
          </div>

          <button
            onClick={() => handleLaunchPractice(activeLesson.operation)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r ${activeLesson.gradient} text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all shrink-0`}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isFr ? "S'entraîner (Quiz)" : 'Practice Quiz'}</span>
          </button>
        </div>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isFr ? activeLesson.summary.fr : activeLesson.summary.en}
        </p>

        {/* Key Formulas */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>{isFr ? 'Règles & Formules à retenir' : 'Key Rules & Formulas'}</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 font-medium">
            {(isFr ? activeLesson.formulas.fr : activeLesson.formulas.en).map((formula, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>{formula}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Worked Example */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>
              {isFr ? 'Exemple résolu :' : 'Worked Example:'}{' '}
              <span className="text-indigo-600 dark:text-indigo-400">
                {isFr ? activeLesson.exampleTitle.fr : activeLesson.exampleTitle.en}
              </span>
            </span>
          </div>
          <div className="space-y-1.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {(isFr ? activeLesson.exampleSteps.fr : activeLesson.exampleSteps.en).map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </div>
        </div>

        {/* Common Pitfall */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">
              {isFr ? 'Piège fréquent à éviter' : 'Common Mistake to Avoid'}
            </strong>
            <span>{isFr ? activeLesson.pitfall.fr : activeLesson.pitfall.en}</span>
          </div>
        </div>

        {/* Interactive Mini-Check */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
          <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            {isFr ? 'Mini-exercice de vérification' : 'Quick Understanding Check'}
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {isFr ? activeLesson.miniQuiz.question.fr : activeLesson.miniQuiz.question.en}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeLesson.miniQuiz.options.map((opt) => {
              const isSelected = selectedQuizChoice === opt;
              const isRight = opt === activeLesson.miniQuiz.correct;
              let style =
                'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

              if (isQuizAnswered) {
                if (isRight) {
                  style = 'bg-emerald-600 border-emerald-600 text-white';
                } else if (isSelected) {
                  style = 'bg-rose-600 border-rose-600 text-white';
                } else {
                  style = 'opacity-50 bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={isQuizAnswered}
                  onClick={() => handleQuizOption(opt)}
                  className={`py-2.5 px-3 min-h-[44px] rounded-xl border font-mono text-sm font-bold transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isQuizAnswered && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                isQuizCorrect
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
              }`}
            >
              {isQuizCorrect ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="font-extrabold block">
                  {isQuizCorrect
                    ? isFr
                      ? 'Bravo, bonne réponse !'
                      : 'Correct!'
                    : isFr
                    ? `Réponse attendue : ${activeLesson.miniQuiz.correct}`
                    : `Expected answer: ${activeLesson.miniQuiz.correct}`}
                </strong>
                <span>
                  {isFr ? activeLesson.miniQuiz.explanation.fr : activeLesson.miniQuiz.explanation.en}
                </span>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Bottom Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <Home className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
        </button>

        <button
          onClick={() => handleLaunchPractice(activeLesson.operation)}
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isFr ? 'Lancer une partie sur ce chapitre' : 'Start Practice Match'}</span>
        </button>
      </div>
    </div>
  );
};
