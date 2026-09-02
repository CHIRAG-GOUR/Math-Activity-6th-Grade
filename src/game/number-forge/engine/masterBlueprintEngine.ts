import { MathChallenge } from '../types';

export interface BlueprintRule {
  id: string;
  description: string;
  validator: (numStr: string, num: number) => boolean;
}

export function createMasterBlueprintChallenge(seedIndex: number): MathChallenge {
  const blueprints = [
    {
      title: 'CHAMBER BLUEPRINT: MK-760',
      hundredThousandsVal: 7,
      thousandsVal: 5,
      tensRuleName: 'Tens digit is an EVEN number (0, 2, 4, 6, 8)',
      roundTarget: 760000,
      roundPlaceName: 'nearest 10,000',
      rules: [
        {
          id: 'digit_len',
          description: 'Must be an exact 6-digit number',
          validator: (s: string) => s.length === 6 && !isNaN(Number(s)),
        },
        {
          id: 'h_th',
          description: 'Hundred-Thousands digit must be 7',
          validator: (s: string) => s[0] === '7',
        },
        {
          id: 'th',
          description: 'Thousands digit must be 5',
          validator: (s: string) => s[2] === '5',
        },
        {
          id: 'tens_even',
          description: 'Tens digit must be EVEN (0, 2, 4, 6, 8)',
          validator: (s: string) => [0, 2, 4, 6, 8].includes(Number(s[4])),
        },
        {
          id: 'rounding',
          description: 'Number must round to 760,000 to the nearest 10,000',
          validator: (_: string, num: number) => {
            const rounded = Math.round(num / 10000) * 10000;
            return rounded === 760000;
          },
        },
      ],
      sampleValid: '755,241 or 764,280',
    },
    {
      title: 'CHAMBER BLUEPRINT: MK-850',
      hundredThousandsVal: 8,
      thousandsVal: 4,
      tensRuleName: 'Tens digit is an EVEN number (0, 2, 4, 6, 8)',
      roundTarget: 850000,
      roundPlaceName: 'nearest 10,000',
      rules: [
        {
          id: 'digit_len',
          description: 'Must be an exact 6-digit number',
          validator: (s: string) => s.length === 6 && !isNaN(Number(s)),
        },
        {
          id: 'h_th',
          description: 'Hundred-Thousands digit must be 8',
          validator: (s: string) => s[0] === '8',
        },
        {
          id: 'th',
          description: 'Thousands digit must be 4',
          validator: (s: string) => s[2] === '4',
        },
        {
          id: 'ones_seven',
          description: 'Ones digit must be 7',
          validator: (s: string) => s[5] === '7',
        },
        {
          id: 'rounding',
          description: 'Number must round to 850,000 to the nearest 10,000',
          validator: (_: string, num: number) => {
            const rounded = Math.round(num / 10000) * 10000;
            return rounded === 850000;
          },
        },
      ],
      sampleValid: '854,027 or 854,167',
    },
  ];

  const bp = blueprints[seedIndex % blueprints.length];

  return {
    id: `master-blueprint-${seedIndex}-${Date.now()}`,
    type: 'master-blueprint',
    bloomLevel: 'create',
    zone: 'blueprint-chamber',
    title: bp.title,
    question: `Construct a 6-digit master number satisfying all forge constraints:\n1. Hundred-Thousands digit = ${bp.hundredThousandsVal}\n2. Thousands digit = ${bp.thousandsVal}\n3. ${bp.tensRuleName}\n4. Rounds to ${bp.roundTarget.toLocaleString()} to the ${bp.roundPlaceName}`,
    promptText: `Assemble the 6 physical number blocks to satisfy all 4 chamber constraints simultaneously!`,
    difficulty: 'challenge',
    points: 300,
    timeLimit: 45,
    data: {
      blueprintConstraints: bp.rules.map(r => ({
        id: r.id,
        description: r.description,
        check: (str: string) => r.validator(str, Number(str)),
      })),
    },
    explanation: `Any 6-digit number satisfying the constraints is valid! Examples: ${bp.sampleValid}. Notice how the Ten-Thousands and Thousands digits work together to trigger the correct rounding!`,
    learningTip: `To round to 760,000, you can either have 755,xxx (where 5 thousands rounds up) or 764,xxx (where 4 thousands stays down)!`,
  };
}

export function validateMasterBlueprintSubmission(
  submittedStr: string,
  constraints: Array<{ id: string; description: string; check: (s: string) => boolean }>
): { isValid: boolean; passedCount: number; failedRules: string[] } {
  const cleanStr = submittedStr.replace(/\D/g, '');
  const failedRules: string[] = [];
  let passedCount = 0;

  for (const c of constraints) {
    if (c.check(cleanStr)) {
      passedCount++;
    } else {
      failedRules.push(c.description);
    }
  }

  return {
    isValid: failedRules.length === 0,
    passedCount,
    failedRules,
  };
}
