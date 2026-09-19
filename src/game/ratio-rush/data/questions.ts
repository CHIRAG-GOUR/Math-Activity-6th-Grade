// ============================================================
// RATIO RUSH — GRADE 6 RATIO & PROPORTION QUESTIONS (160+ QUESTION BANK)
// Comprehensive curriculum-aligned ratio scenarios with intuitive scaling.
// On every session reload, 5 random questions are sampled across stages 1-5.
// ============================================================

import { RatioQuestion } from '../types';

export const RATIO_QUESTIONS: RatioQuestion[] = [
  {
    "id": "q1_camera_shot_ratio",
    "stage": 1,
    "title": "Stage 1: Camera Shot Ratio",
    "scenario": "Camera Shot Ratio on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Close-Up Shots to Wide Shots is 1 : 2. If there are 2 Close-Up Shots, how many Wide Shots are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Close-Up Shots",
    "labelB": "Wide Shots",
    "targetQuantityName": "Wide Shots",
    "givenQuantityName": "Close-Up Shots",
    "givenQuantityValue": 2,
    "correctAnswer": 4,
    "correctUnit": "shots",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "2 Close-Up Shots represents a scale multiplier of 2 (2 ÷ 1 = 2). Multiplying 2 × 2 = 4 shots (Ratio 1 : 2 = 2 : 4).",
    "studioActionText": "Camera Operator lines up the perfect 16:9 cinematic shot!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 2,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q2_camera_shot_ratio",
    "stage": 2,
    "title": "Stage 2: Camera Shot Ratio",
    "scenario": "Camera Shot Ratio on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Close-Up Shots to Wide Shots is 1 : 3. If there are 15 Wide Shots, how many Close-Up Shots are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Close-Up Shots",
    "labelB": "Wide Shots",
    "targetQuantityName": "Close-Up Shots",
    "givenQuantityName": "Wide Shots",
    "givenQuantityValue": 15,
    "correctAnswer": 5,
    "correctUnit": "shots",
    "options": [
      3,
      4,
      5,
      6
    ],
    "unitRateExplanation": "15 Wide Shots represents a scale multiplier of 5 (15 ÷ 3 = 5). Multiplying 1 × 5 = 5 shots (Ratio 1 : 3 = 5 : 15).",
    "studioActionText": "Camera Operator lines up the perfect 16:9 cinematic shot!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 5,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 6,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q3_camera_shot_ratio",
    "stage": 3,
    "title": "Stage 3: Camera Shot Ratio",
    "scenario": "Camera Shot Ratio on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Close-Up Shots to Wide Shots is 1 : 4. If there are 8 Close-Up Shots, how many Wide Shots are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "Close-Up Shots",
    "labelB": "Wide Shots",
    "targetQuantityName": "Wide Shots",
    "givenQuantityName": "Close-Up Shots",
    "givenQuantityValue": 8,
    "correctAnswer": 32,
    "correctUnit": "shots",
    "options": [
      16,
      24,
      32,
      40
    ],
    "unitRateExplanation": "8 Close-Up Shots represents a scale multiplier of 8 (8 ÷ 1 = 8). Multiplying 4 × 8 = 32 shots (Ratio 1 : 4 = 8 : 32).",
    "studioActionText": "Camera Operator lines up the perfect 16:9 cinematic shot!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 8,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 16,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 40,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q4_camera_shot_ratio",
    "stage": 4,
    "title": "Stage 4: Camera Shot Ratio",
    "scenario": "Camera Shot Ratio on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Close-Up Shots to Wide Shots is 1 : 5. If there are 60 Wide Shots, how many Close-Up Shots are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Close-Up Shots",
    "labelB": "Wide Shots",
    "targetQuantityName": "Close-Up Shots",
    "givenQuantityName": "Wide Shots",
    "givenQuantityValue": 60,
    "correctAnswer": 12,
    "correctUnit": "shots",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "60 Wide Shots represents a scale multiplier of 12 (60 ÷ 5 = 12). Multiplying 1 × 12 = 12 shots (Ratio 1 : 5 = 12 : 60).",
    "studioActionText": "Camera Operator lines up the perfect 16:9 cinematic shot!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 12,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q5_lens_focal_lengths",
    "stage": 5,
    "title": "Stage 5: Lens Focal Lengths",
    "scenario": "Lens Focal Lengths on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Prime Lenses to Zoom Lenses is 1 : 5. If there are 6 Prime Lenses, how many Zoom Lenses are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Prime Lenses",
    "labelB": "Zoom Lenses",
    "targetQuantityName": "Zoom Lenses",
    "givenQuantityName": "Prime Lenses",
    "givenQuantityValue": 6,
    "correctAnswer": 30,
    "correctUnit": "lenses",
    "options": [
      15,
      23,
      30,
      38
    ],
    "unitRateExplanation": "6 Prime Lenses represents a scale multiplier of 6 (6 ÷ 1 = 6). Multiplying 5 × 6 = 30 lenses (Ratio 1 : 5 = 6 : 30).",
    "studioActionText": "Focus Puller calibrates high-precision cine lenses!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 6,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 15,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 38,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q6_lens_focal_lengths",
    "stage": 1,
    "title": "Stage 1: Lens Focal Lengths",
    "scenario": "Lens Focal Lengths on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Prime Lenses to Zoom Lenses is 2 : 3. If there are 27 Zoom Lenses, how many Prime Lenses are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "Prime Lenses",
    "labelB": "Zoom Lenses",
    "targetQuantityName": "Prime Lenses",
    "givenQuantityName": "Zoom Lenses",
    "givenQuantityValue": 27,
    "correctAnswer": 18,
    "correctUnit": "lenses",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "27 Zoom Lenses represents a scale multiplier of 9 (27 ÷ 3 = 9). Multiplying 2 × 9 = 18 lenses (Ratio 2 : 3 = 18 : 27).",
    "studioActionText": "Focus Puller calibrates high-precision cine lenses!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 9,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q7_lens_focal_lengths",
    "stage": 2,
    "title": "Stage 2: Lens Focal Lengths",
    "scenario": "Lens Focal Lengths on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Prime Lenses to Zoom Lenses is 2 : 5. If there are 30 Prime Lenses, how many Zoom Lenses are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "Prime Lenses",
    "labelB": "Zoom Lenses",
    "targetQuantityName": "Zoom Lenses",
    "givenQuantityName": "Prime Lenses",
    "givenQuantityValue": 30,
    "correctAnswer": 75,
    "correctUnit": "lenses",
    "options": [
      38,
      56,
      75,
      94
    ],
    "unitRateExplanation": "30 Prime Lenses represents a scale multiplier of 15 (30 ÷ 2 = 15). Multiplying 5 × 15 = 75 lenses (Ratio 2 : 5 = 30 : 75).",
    "studioActionText": "Focus Puller calibrates high-precision cine lenses!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 15,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 38,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 94,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q8_lens_focal_lengths",
    "stage": 3,
    "title": "Stage 3: Lens Focal Lengths",
    "scenario": "Lens Focal Lengths on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Prime Lenses to Zoom Lenses is 3 : 4. If there are 12 Zoom Lenses, how many Prime Lenses are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Prime Lenses",
    "labelB": "Zoom Lenses",
    "targetQuantityName": "Prime Lenses",
    "givenQuantityName": "Zoom Lenses",
    "givenQuantityValue": 12,
    "correctAnswer": 9,
    "correctUnit": "lenses",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "12 Zoom Lenses represents a scale multiplier of 3 (12 ÷ 4 = 3). Multiplying 3 × 3 = 9 lenses (Ratio 3 : 4 = 9 : 12).",
    "studioActionText": "Focus Puller calibrates high-precision cine lenses!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 3,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q9_drone_aerial_passes",
    "stage": 4,
    "title": "Stage 4: Drone Aerial Passes",
    "scenario": "Drone Aerial Passes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Low Passes to High Altitude Passes is 3 : 4. If there are 30 Low Passes, how many High Altitude Passes are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Low Passes",
    "labelB": "High Altitude Passes",
    "targetQuantityName": "High Altitude Passes",
    "givenQuantityName": "Low Passes",
    "givenQuantityValue": 30,
    "correctAnswer": 40,
    "correctUnit": "passes",
    "options": [
      20,
      30,
      40,
      50
    ],
    "unitRateExplanation": "30 Low Passes represents a scale multiplier of 10 (30 ÷ 3 = 10). Multiplying 4 × 10 = 40 passes (Ratio 3 : 4 = 30 : 40).",
    "studioActionText": "Drone Pilot executes smooth swooping cinematic flight!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 10,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 20,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 50,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q10_drone_aerial_passes",
    "stage": 5,
    "title": "Stage 5: Drone Aerial Passes",
    "scenario": "Drone Aerial Passes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Low Passes to High Altitude Passes is 3 : 5. If there are 100 High Altitude Passes, how many Low Passes are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Low Passes",
    "labelB": "High Altitude Passes",
    "targetQuantityName": "Low Passes",
    "givenQuantityName": "High Altitude Passes",
    "givenQuantityValue": 100,
    "correctAnswer": 60,
    "correctUnit": "passes",
    "options": [
      30,
      45,
      60,
      75
    ],
    "unitRateExplanation": "100 High Altitude Passes represents a scale multiplier of 20 (100 ÷ 5 = 20). Multiplying 3 × 20 = 60 passes (Ratio 3 : 5 = 60 : 100).",
    "studioActionText": "Drone Pilot executes smooth swooping cinematic flight!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 20,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 30,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 75,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q11_drone_aerial_passes",
    "stage": 1,
    "title": "Stage 1: Drone Aerial Passes",
    "scenario": "Drone Aerial Passes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Low Passes to High Altitude Passes is 4 : 5. If there are 16 Low Passes, how many High Altitude Passes are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Low Passes",
    "labelB": "High Altitude Passes",
    "targetQuantityName": "High Altitude Passes",
    "givenQuantityName": "Low Passes",
    "givenQuantityValue": 16,
    "correctAnswer": 20,
    "correctUnit": "passes",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "16 Low Passes represents a scale multiplier of 4 (16 ÷ 4 = 4). Multiplying 5 × 4 = 20 passes (Ratio 4 : 5 = 16 : 20).",
    "studioActionText": "Drone Pilot executes smooth swooping cinematic flight!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 4,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q12_drone_aerial_passes",
    "stage": 2,
    "title": "Stage 2: Drone Aerial Passes",
    "scenario": "Drone Aerial Passes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Low Passes to High Altitude Passes is 2 : 7. If there are 49 High Altitude Passes, how many Low Passes are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Low Passes",
    "labelB": "High Altitude Passes",
    "targetQuantityName": "Low Passes",
    "givenQuantityName": "High Altitude Passes",
    "givenQuantityValue": 49,
    "correctAnswer": 14,
    "correctUnit": "passes",
    "options": [
      7,
      11,
      14,
      18
    ],
    "unitRateExplanation": "49 High Altitude Passes represents a scale multiplier of 7 (49 ÷ 7 = 7). Multiplying 2 × 7 = 14 passes (Ratio 2 : 7 = 14 : 49).",
    "studioActionText": "Drone Pilot executes smooth swooping cinematic flight!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 7,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 7,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 18,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q13_steadicam_tracking",
    "stage": 3,
    "title": "Stage 3: Steadicam Tracking",
    "scenario": "Steadicam Tracking on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Tracking Steps to Pivots is 2 : 7. If there are 4 Tracking Steps, how many Pivots are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Tracking Steps",
    "labelB": "Pivots",
    "targetQuantityName": "Pivots",
    "givenQuantityName": "Tracking Steps",
    "givenQuantityValue": 4,
    "correctAnswer": 14,
    "correctUnit": "steps",
    "options": [
      7,
      11,
      14,
      18
    ],
    "unitRateExplanation": "4 Tracking Steps represents a scale multiplier of 2 (4 ÷ 2 = 2). Multiplying 7 × 2 = 14 steps (Ratio 2 : 7 = 4 : 14).",
    "studioActionText": "Steadicam Operator glides smoothly alongside the actors!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 2,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 7,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 18,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q14_steadicam_tracking",
    "stage": 4,
    "title": "Stage 4: Steadicam Tracking",
    "scenario": "Steadicam Tracking on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Tracking Steps to Pivots is 3 : 7. If there are 35 Pivots, how many Tracking Steps are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Tracking Steps",
    "labelB": "Pivots",
    "targetQuantityName": "Tracking Steps",
    "givenQuantityName": "Pivots",
    "givenQuantityValue": 35,
    "correctAnswer": 15,
    "correctUnit": "steps",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "35 Pivots represents a scale multiplier of 5 (35 ÷ 7 = 5). Multiplying 3 × 5 = 15 steps (Ratio 3 : 7 = 15 : 35).",
    "studioActionText": "Steadicam Operator glides smoothly alongside the actors!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 5,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q15_steadicam_tracking",
    "stage": 5,
    "title": "Stage 5: Steadicam Tracking",
    "scenario": "Steadicam Tracking on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Tracking Steps to Pivots is 5 : 6. If there are 40 Tracking Steps, how many Pivots are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Tracking Steps",
    "labelB": "Pivots",
    "targetQuantityName": "Pivots",
    "givenQuantityName": "Tracking Steps",
    "givenQuantityValue": 40,
    "correctAnswer": 48,
    "correctUnit": "steps",
    "options": [
      24,
      36,
      48,
      60
    ],
    "unitRateExplanation": "40 Tracking Steps represents a scale multiplier of 8 (40 ÷ 5 = 8). Multiplying 6 × 8 = 48 steps (Ratio 5 : 6 = 40 : 48).",
    "studioActionText": "Steadicam Operator glides smoothly alongside the actors!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 8,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 24,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 60,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q16_steadicam_tracking",
    "stage": 1,
    "title": "Stage 1: Steadicam Tracking",
    "scenario": "Steadicam Tracking on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Tracking Steps to Pivots is 1 : 10. If there are 120 Pivots, how many Tracking Steps are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Tracking Steps",
    "labelB": "Pivots",
    "targetQuantityName": "Tracking Steps",
    "givenQuantityName": "Pivots",
    "givenQuantityValue": 120,
    "correctAnswer": 12,
    "correctUnit": "steps",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "120 Pivots represents a scale multiplier of 12 (120 ÷ 10 = 12). Multiplying 1 × 12 = 12 steps (Ratio 1 : 10 = 12 : 120).",
    "studioActionText": "Steadicam Operator glides smoothly alongside the actors!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 12,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q17_multi_camera_rig",
    "stage": 2,
    "title": "Stage 2: Multi-Camera Rig",
    "scenario": "Multi-Camera Rig on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Angle A Cameras to Angle B Cameras is 1 : 10. If there are 6 Angle A Cameras, how many Angle B Cameras are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Angle A Cameras",
    "labelB": "Angle B Cameras",
    "targetQuantityName": "Angle B Cameras",
    "givenQuantityName": "Angle A Cameras",
    "givenQuantityValue": 6,
    "correctAnswer": 60,
    "correctUnit": "cameras",
    "options": [
      30,
      45,
      60,
      75
    ],
    "unitRateExplanation": "6 Angle A Cameras represents a scale multiplier of 6 (6 ÷ 1 = 6). Multiplying 10 × 6 = 60 cameras (Ratio 1 : 10 = 6 : 60).",
    "studioActionText": "Technical Director syncs timecodes across all rigs!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 6,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 30,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 75,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q18_multi_camera_rig",
    "stage": 3,
    "title": "Stage 3: Multi-Camera Rig",
    "scenario": "Multi-Camera Rig on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Angle A Cameras to Angle B Cameras is 2 : 1. If there are 9 Angle B Cameras, how many Angle A Cameras are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "Angle A Cameras",
    "labelB": "Angle B Cameras",
    "targetQuantityName": "Angle A Cameras",
    "givenQuantityName": "Angle B Cameras",
    "givenQuantityValue": 9,
    "correctAnswer": 18,
    "correctUnit": "cameras",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "9 Angle B Cameras represents a scale multiplier of 9 (9 ÷ 1 = 9). Multiplying 2 × 9 = 18 cameras (Ratio 2 : 1 = 18 : 9).",
    "studioActionText": "Technical Director syncs timecodes across all rigs!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 9,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q19_multi_camera_rig",
    "stage": 4,
    "title": "Stage 4: Multi-Camera Rig",
    "scenario": "Multi-Camera Rig on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Angle A Cameras to Angle B Cameras is 3 : 1. If there are 45 Angle A Cameras, how many Angle B Cameras are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "Angle A Cameras",
    "labelB": "Angle B Cameras",
    "targetQuantityName": "Angle B Cameras",
    "givenQuantityName": "Angle A Cameras",
    "givenQuantityValue": 45,
    "correctAnswer": 15,
    "correctUnit": "cameras",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "45 Angle A Cameras represents a scale multiplier of 15 (45 ÷ 3 = 15). Multiplying 1 × 15 = 15 cameras (Ratio 3 : 1 = 45 : 15).",
    "studioActionText": "Technical Director syncs timecodes across all rigs!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 15,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q20_multi_camera_rig",
    "stage": 5,
    "title": "Stage 5: Multi-Camera Rig",
    "scenario": "Multi-Camera Rig on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Angle A Cameras to Angle B Cameras is 3 : 2. If there are 6 Angle B Cameras, how many Angle A Cameras are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Angle A Cameras",
    "labelB": "Angle B Cameras",
    "targetQuantityName": "Angle A Cameras",
    "givenQuantityName": "Angle B Cameras",
    "givenQuantityValue": 6,
    "correctAnswer": 9,
    "correctUnit": "cameras",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "6 Angle B Cameras represents a scale multiplier of 3 (6 ÷ 2 = 3). Multiplying 3 × 3 = 9 cameras (Ratio 3 : 2 = 9 : 6).",
    "studioActionText": "Technical Director syncs timecodes across all rigs!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 3,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q21_key_fill_lights",
    "stage": 1,
    "title": "Stage 1: Key & Fill Lights",
    "scenario": "Key & Fill Lights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Key Lights to Fill Lights is 2 : 5. If there are 6 Key Lights, how many Fill Lights are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "Key Lights",
    "labelB": "Fill Lights",
    "targetQuantityName": "Fill Lights",
    "givenQuantityName": "Key Lights",
    "givenQuantityValue": 6,
    "correctAnswer": 15,
    "correctUnit": "fixtures",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "6 Key Lights represents a scale multiplier of 3 (6 ÷ 2 = 3). Multiplying 5 × 3 = 15 fixtures (Ratio 2 : 5 = 6 : 15).",
    "studioActionText": "Gaffer balances three-point lighting for dramatic contrast!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 3,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q22_key_fill_lights",
    "stage": 2,
    "title": "Stage 2: Key & Fill Lights",
    "scenario": "Key & Fill Lights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Key Lights to Fill Lights is 3 : 4. If there are 24 Fill Lights, how many Key Lights are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Key Lights",
    "labelB": "Fill Lights",
    "targetQuantityName": "Key Lights",
    "givenQuantityName": "Fill Lights",
    "givenQuantityValue": 24,
    "correctAnswer": 18,
    "correctUnit": "fixtures",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "24 Fill Lights represents a scale multiplier of 6 (24 ÷ 4 = 6). Multiplying 3 × 6 = 18 fixtures (Ratio 3 : 4 = 18 : 24).",
    "studioActionText": "Gaffer balances three-point lighting for dramatic contrast!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 6,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q23_key_fill_lights",
    "stage": 3,
    "title": "Stage 3: Key & Fill Lights",
    "scenario": "Key & Fill Lights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Key Lights to Fill Lights is 3 : 5. If there are 27 Key Lights, how many Fill Lights are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Key Lights",
    "labelB": "Fill Lights",
    "targetQuantityName": "Fill Lights",
    "givenQuantityName": "Key Lights",
    "givenQuantityValue": 27,
    "correctAnswer": 45,
    "correctUnit": "fixtures",
    "options": [
      23,
      34,
      45,
      56
    ],
    "unitRateExplanation": "27 Key Lights represents a scale multiplier of 9 (27 ÷ 3 = 9). Multiplying 5 × 9 = 45 fixtures (Ratio 3 : 5 = 27 : 45).",
    "studioActionText": "Gaffer balances three-point lighting for dramatic contrast!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 9,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 23,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 56,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q24_key_fill_lights",
    "stage": 4,
    "title": "Stage 4: Key & Fill Lights",
    "scenario": "Key & Fill Lights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Key Lights to Fill Lights is 4 : 5. If there are 75 Fill Lights, how many Key Lights are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Key Lights",
    "labelB": "Fill Lights",
    "targetQuantityName": "Key Lights",
    "givenQuantityName": "Fill Lights",
    "givenQuantityValue": 75,
    "correctAnswer": 60,
    "correctUnit": "fixtures",
    "options": [
      30,
      45,
      60,
      75
    ],
    "unitRateExplanation": "75 Fill Lights represents a scale multiplier of 15 (75 ÷ 5 = 15). Multiplying 4 × 15 = 60 fixtures (Ratio 4 : 5 = 60 : 75).",
    "studioActionText": "Gaffer balances three-point lighting for dramatic contrast!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 15,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 30,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 75,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q25_gel_filter_packs",
    "stage": 5,
    "title": "Stage 5: Gel Filter Packs",
    "scenario": "Gel Filter Packs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Warm Amber Gels to Cool Blue Gels is 4 : 5. If there are 28 Warm Amber Gels, how many Cool Blue Gels are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Warm Amber Gels",
    "labelB": "Cool Blue Gels",
    "targetQuantityName": "Cool Blue Gels",
    "givenQuantityName": "Warm Amber Gels",
    "givenQuantityValue": 28,
    "correctAnswer": 35,
    "correctUnit": "gels",
    "options": [
      18,
      26,
      35,
      44
    ],
    "unitRateExplanation": "28 Warm Amber Gels represents a scale multiplier of 7 (28 ÷ 4 = 7). Multiplying 5 × 7 = 35 gels (Ratio 4 : 5 = 28 : 35).",
    "studioActionText": "Best Boy Electric clamps color temperature filters!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 7,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 44,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q26_gel_filter_packs",
    "stage": 1,
    "title": "Stage 1: Gel Filter Packs",
    "scenario": "Gel Filter Packs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Warm Amber Gels to Cool Blue Gels is 2 : 7. If there are 70 Cool Blue Gels, how many Warm Amber Gels are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Warm Amber Gels",
    "labelB": "Cool Blue Gels",
    "targetQuantityName": "Warm Amber Gels",
    "givenQuantityName": "Cool Blue Gels",
    "givenQuantityValue": 70,
    "correctAnswer": 20,
    "correctUnit": "gels",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "70 Cool Blue Gels represents a scale multiplier of 10 (70 ÷ 7 = 10). Multiplying 2 × 10 = 20 gels (Ratio 2 : 7 = 20 : 70).",
    "studioActionText": "Best Boy Electric clamps color temperature filters!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 10,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q27_gel_filter_packs",
    "stage": 2,
    "title": "Stage 2: Gel Filter Packs",
    "scenario": "Gel Filter Packs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Warm Amber Gels to Cool Blue Gels is 3 : 7. If there are 60 Warm Amber Gels, how many Cool Blue Gels are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Warm Amber Gels",
    "labelB": "Cool Blue Gels",
    "targetQuantityName": "Cool Blue Gels",
    "givenQuantityName": "Warm Amber Gels",
    "givenQuantityValue": 60,
    "correctAnswer": 140,
    "correctUnit": "gels",
    "options": [
      70,
      105,
      140,
      175
    ],
    "unitRateExplanation": "60 Warm Amber Gels represents a scale multiplier of 20 (60 ÷ 3 = 20). Multiplying 7 × 20 = 140 gels (Ratio 3 : 7 = 60 : 140).",
    "studioActionText": "Best Boy Electric clamps color temperature filters!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 20,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 70,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 175,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q28_gel_filter_packs",
    "stage": 3,
    "title": "Stage 3: Gel Filter Packs",
    "scenario": "Gel Filter Packs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Warm Amber Gels to Cool Blue Gels is 5 : 6. If there are 24 Cool Blue Gels, how many Warm Amber Gels are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Warm Amber Gels",
    "labelB": "Cool Blue Gels",
    "targetQuantityName": "Warm Amber Gels",
    "givenQuantityName": "Cool Blue Gels",
    "givenQuantityValue": 24,
    "correctAnswer": 20,
    "correctUnit": "gels",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "24 Cool Blue Gels represents a scale multiplier of 4 (24 ÷ 6 = 4). Multiplying 5 × 4 = 20 gels (Ratio 5 : 6 = 20 : 24).",
    "studioActionText": "Best Boy Electric clamps color temperature filters!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 4,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q29_studio_floodlights",
    "stage": 4,
    "title": "Stage 4: Studio Floodlights",
    "scenario": "Studio Floodlights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of LED Panels to Fresnel Spotlights is 5 : 6. If there are 60 LED Panels, how many Fresnel Spotlights are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "LED Panels",
    "labelB": "Fresnel Spotlights",
    "targetQuantityName": "Fresnel Spotlights",
    "givenQuantityName": "LED Panels",
    "givenQuantityValue": 60,
    "correctAnswer": 72,
    "correctUnit": "lights",
    "options": [
      36,
      54,
      72,
      90
    ],
    "unitRateExplanation": "60 LED Panels represents a scale multiplier of 12 (60 ÷ 5 = 12). Multiplying 6 × 12 = 72 lights (Ratio 5 : 6 = 60 : 72).",
    "studioActionText": "Lighting Crew illuminates the entire soundstage grid!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 12,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 36,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 90,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q30_studio_floodlights",
    "stage": 5,
    "title": "Stage 5: Studio Floodlights",
    "scenario": "Studio Floodlights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of LED Panels to Fresnel Spotlights is 1 : 10. If there are 20 Fresnel Spotlights, how many LED Panels are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "LED Panels",
    "labelB": "Fresnel Spotlights",
    "targetQuantityName": "LED Panels",
    "givenQuantityName": "Fresnel Spotlights",
    "givenQuantityValue": 20,
    "correctAnswer": 2,
    "correctUnit": "lights",
    "options": [
      1,
      2,
      3,
      5
    ],
    "unitRateExplanation": "20 Fresnel Spotlights represents a scale multiplier of 2 (20 ÷ 10 = 2). Multiplying 1 × 2 = 2 lights (Ratio 1 : 10 = 2 : 20).",
    "studioActionText": "Lighting Crew illuminates the entire soundstage grid!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 2,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 1,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q31_studio_floodlights",
    "stage": 1,
    "title": "Stage 1: Studio Floodlights",
    "scenario": "Studio Floodlights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of LED Panels to Fresnel Spotlights is 2 : 1. If there are 10 LED Panels, how many Fresnel Spotlights are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "LED Panels",
    "labelB": "Fresnel Spotlights",
    "targetQuantityName": "Fresnel Spotlights",
    "givenQuantityName": "LED Panels",
    "givenQuantityValue": 10,
    "correctAnswer": 5,
    "correctUnit": "lights",
    "options": [
      3,
      4,
      5,
      6
    ],
    "unitRateExplanation": "10 LED Panels represents a scale multiplier of 5 (10 ÷ 2 = 5). Multiplying 1 × 5 = 5 lights (Ratio 2 : 1 = 10 : 5).",
    "studioActionText": "Lighting Crew illuminates the entire soundstage grid!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 5,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 6,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q32_studio_floodlights",
    "stage": 2,
    "title": "Stage 2: Studio Floodlights",
    "scenario": "Studio Floodlights on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of LED Panels to Fresnel Spotlights is 3 : 1. If there are 8 Fresnel Spotlights, how many LED Panels are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "LED Panels",
    "labelB": "Fresnel Spotlights",
    "targetQuantityName": "LED Panels",
    "givenQuantityName": "Fresnel Spotlights",
    "givenQuantityValue": 8,
    "correctAnswer": 24,
    "correctUnit": "lights",
    "options": [
      12,
      18,
      24,
      30
    ],
    "unitRateExplanation": "8 Fresnel Spotlights represents a scale multiplier of 8 (8 ÷ 1 = 8). Multiplying 3 × 8 = 24 lights (Ratio 3 : 1 = 24 : 8).",
    "studioActionText": "Lighting Crew illuminates the entire soundstage grid!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 8,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 12,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 30,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q33_reflector_bounce_boards",
    "stage": 3,
    "title": "Stage 3: Reflector Bounce Boards",
    "scenario": "Reflector Bounce Boards on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Reflectors to Gold Reflectors is 3 : 1. If there are 9 Silver Reflectors, how many Gold Reflectors are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "Silver Reflectors",
    "labelB": "Gold Reflectors",
    "targetQuantityName": "Gold Reflectors",
    "givenQuantityName": "Silver Reflectors",
    "givenQuantityValue": 9,
    "correctAnswer": 3,
    "correctUnit": "boards",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "9 Silver Reflectors represents a scale multiplier of 3 (9 ÷ 3 = 3). Multiplying 1 × 3 = 3 boards (Ratio 3 : 1 = 9 : 3).",
    "studioActionText": "Grip angles bounce boards to soften shadows on the cast!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 3,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q34_reflector_bounce_boards",
    "stage": 4,
    "title": "Stage 4: Reflector Bounce Boards",
    "scenario": "Reflector Bounce Boards on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Reflectors to Gold Reflectors is 3 : 2. If there are 12 Gold Reflectors, how many Silver Reflectors are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Silver Reflectors",
    "labelB": "Gold Reflectors",
    "targetQuantityName": "Silver Reflectors",
    "givenQuantityName": "Gold Reflectors",
    "givenQuantityValue": 12,
    "correctAnswer": 18,
    "correctUnit": "boards",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "12 Gold Reflectors represents a scale multiplier of 6 (12 ÷ 2 = 6). Multiplying 3 × 6 = 18 boards (Ratio 3 : 2 = 18 : 12).",
    "studioActionText": "Grip angles bounce boards to soften shadows on the cast!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 6,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q35_reflector_bounce_boards",
    "stage": 5,
    "title": "Stage 5: Reflector Bounce Boards",
    "scenario": "Reflector Bounce Boards on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Reflectors to Gold Reflectors is 4 : 1. If there are 36 Silver Reflectors, how many Gold Reflectors are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Silver Reflectors",
    "labelB": "Gold Reflectors",
    "targetQuantityName": "Gold Reflectors",
    "givenQuantityName": "Silver Reflectors",
    "givenQuantityValue": 36,
    "correctAnswer": 9,
    "correctUnit": "boards",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "36 Silver Reflectors represents a scale multiplier of 9 (36 ÷ 4 = 9). Multiplying 1 × 9 = 9 boards (Ratio 4 : 1 = 36 : 9).",
    "studioActionText": "Grip angles bounce boards to soften shadows on the cast!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 9,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q36_reflector_bounce_boards",
    "stage": 1,
    "title": "Stage 1: Reflector Bounce Boards",
    "scenario": "Reflector Bounce Boards on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Reflectors to Gold Reflectors is 5 : 2. If there are 30 Gold Reflectors, how many Silver Reflectors are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Silver Reflectors",
    "labelB": "Gold Reflectors",
    "targetQuantityName": "Silver Reflectors",
    "givenQuantityName": "Gold Reflectors",
    "givenQuantityValue": 30,
    "correctAnswer": 75,
    "correctUnit": "boards",
    "options": [
      38,
      56,
      75,
      94
    ],
    "unitRateExplanation": "30 Gold Reflectors represents a scale multiplier of 15 (30 ÷ 2 = 15). Multiplying 5 × 15 = 75 boards (Ratio 5 : 2 = 75 : 30).",
    "studioActionText": "Grip angles bounce boards to soften shadows on the cast!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 15,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 38,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 94,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q37_dimmer_rack_channels",
    "stage": 2,
    "title": "Stage 2: Dimmer Rack Channels",
    "scenario": "Dimmer Rack Channels on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Overhead Channels to Floor Channels is 5 : 2. If there are 35 Overhead Channels, how many Floor Channels are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Overhead Channels",
    "labelB": "Floor Channels",
    "targetQuantityName": "Floor Channels",
    "givenQuantityName": "Overhead Channels",
    "givenQuantityValue": 35,
    "correctAnswer": 14,
    "correctUnit": "channels",
    "options": [
      7,
      11,
      14,
      18
    ],
    "unitRateExplanation": "35 Overhead Channels represents a scale multiplier of 7 (35 ÷ 5 = 7). Multiplying 2 × 7 = 14 channels (Ratio 5 : 2 = 35 : 14).",
    "studioActionText": "Board Operator programs the automated lighting cues!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 7,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 7,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 18,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q38_dimmer_rack_channels",
    "stage": 3,
    "title": "Stage 3: Dimmer Rack Channels",
    "scenario": "Dimmer Rack Channels on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Overhead Channels to Floor Channels is 4 : 3. If there are 30 Floor Channels, how many Overhead Channels are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Overhead Channels",
    "labelB": "Floor Channels",
    "targetQuantityName": "Overhead Channels",
    "givenQuantityName": "Floor Channels",
    "givenQuantityValue": 30,
    "correctAnswer": 40,
    "correctUnit": "channels",
    "options": [
      20,
      30,
      40,
      50
    ],
    "unitRateExplanation": "30 Floor Channels represents a scale multiplier of 10 (30 ÷ 3 = 10). Multiplying 4 × 10 = 40 channels (Ratio 4 : 3 = 40 : 30).",
    "studioActionText": "Board Operator programs the automated lighting cues!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 10,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 20,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 50,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q39_dimmer_rack_channels",
    "stage": 4,
    "title": "Stage 4: Dimmer Rack Channels",
    "scenario": "Dimmer Rack Channels on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Overhead Channels to Floor Channels is 5 : 3. If there are 100 Overhead Channels, how many Floor Channels are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Overhead Channels",
    "labelB": "Floor Channels",
    "targetQuantityName": "Floor Channels",
    "givenQuantityName": "Overhead Channels",
    "givenQuantityValue": 100,
    "correctAnswer": 60,
    "correctUnit": "channels",
    "options": [
      30,
      45,
      60,
      75
    ],
    "unitRateExplanation": "100 Overhead Channels represents a scale multiplier of 20 (100 ÷ 5 = 20). Multiplying 3 × 20 = 60 channels (Ratio 5 : 3 = 100 : 60).",
    "studioActionText": "Board Operator programs the automated lighting cues!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 20,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 30,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 75,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q40_dimmer_rack_channels",
    "stage": 5,
    "title": "Stage 5: Dimmer Rack Channels",
    "scenario": "Dimmer Rack Channels on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Overhead Channels to Floor Channels is 7 : 2. If there are 8 Floor Channels, how many Overhead Channels are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Overhead Channels",
    "labelB": "Floor Channels",
    "targetQuantityName": "Overhead Channels",
    "givenQuantityName": "Floor Channels",
    "givenQuantityValue": 8,
    "correctAnswer": 28,
    "correctUnit": "channels",
    "options": [
      14,
      21,
      28,
      35
    ],
    "unitRateExplanation": "8 Floor Channels represents a scale multiplier of 4 (8 ÷ 2 = 4). Multiplying 7 × 4 = 28 channels (Ratio 7 : 2 = 28 : 8).",
    "studioActionText": "Board Operator programs the automated lighting cues!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 4,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 14,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 35,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q41_green_screen_paint_mix",
    "stage": 1,
    "title": "Stage 1: Green Screen Paint Mix",
    "scenario": "Green Screen Paint Mix on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Dye (cups) to Green Paint (cups) is 3 : 7. If there are 12 Blue Dye (cups), how many Green Paint (cups) are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Blue Dye (cups)",
    "labelB": "Green Paint (cups)",
    "targetQuantityName": "Green Paint (cups)",
    "givenQuantityName": "Blue Dye (cups)",
    "givenQuantityValue": 12,
    "correctAnswer": 28,
    "correctUnit": "cups",
    "options": [
      14,
      21,
      28,
      35
    ],
    "unitRateExplanation": "12 Blue Dye (cups) represents a scale multiplier of 4 (12 ÷ 3 = 4). Multiplying 7 × 4 = 28 cups (Ratio 3 : 7 = 12 : 28).",
    "studioActionText": "Stagehands finish painting the bright green cyclorama wall!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 4,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 14,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 35,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q42_green_screen_paint_mix",
    "stage": 2,
    "title": "Stage 2: Green Screen Paint Mix",
    "scenario": "Green Screen Paint Mix on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Dye (cups) to Green Paint (cups) is 5 : 6. If there are 42 Green Paint (cups), how many Blue Dye (cups) are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Blue Dye (cups)",
    "labelB": "Green Paint (cups)",
    "targetQuantityName": "Blue Dye (cups)",
    "givenQuantityName": "Green Paint (cups)",
    "givenQuantityValue": 42,
    "correctAnswer": 35,
    "correctUnit": "cups",
    "options": [
      18,
      26,
      35,
      44
    ],
    "unitRateExplanation": "42 Green Paint (cups) represents a scale multiplier of 7 (42 ÷ 6 = 7). Multiplying 5 × 7 = 35 cups (Ratio 5 : 6 = 35 : 42).",
    "studioActionText": "Stagehands finish painting the bright green cyclorama wall!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 7,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 44,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q43_green_screen_paint_mix",
    "stage": 3,
    "title": "Stage 3: Green Screen Paint Mix",
    "scenario": "Green Screen Paint Mix on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Dye (cups) to Green Paint (cups) is 1 : 10. If there are 10 Blue Dye (cups), how many Green Paint (cups) are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Blue Dye (cups)",
    "labelB": "Green Paint (cups)",
    "targetQuantityName": "Green Paint (cups)",
    "givenQuantityName": "Blue Dye (cups)",
    "givenQuantityValue": 10,
    "correctAnswer": 100,
    "correctUnit": "cups",
    "options": [
      50,
      75,
      100,
      125
    ],
    "unitRateExplanation": "10 Blue Dye (cups) represents a scale multiplier of 10 (10 ÷ 1 = 10). Multiplying 10 × 10 = 100 cups (Ratio 1 : 10 = 10 : 100).",
    "studioActionText": "Stagehands finish painting the bright green cyclorama wall!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 10,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 50,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 125,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q44_green_screen_paint_mix",
    "stage": 4,
    "title": "Stage 4: Green Screen Paint Mix",
    "scenario": "Green Screen Paint Mix on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Dye (cups) to Green Paint (cups) is 2 : 1. If there are 20 Green Paint (cups), how many Blue Dye (cups) are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "Blue Dye (cups)",
    "labelB": "Green Paint (cups)",
    "targetQuantityName": "Blue Dye (cups)",
    "givenQuantityName": "Green Paint (cups)",
    "givenQuantityValue": 20,
    "correctAnswer": 40,
    "correctUnit": "cups",
    "options": [
      20,
      30,
      40,
      50
    ],
    "unitRateExplanation": "20 Green Paint (cups) represents a scale multiplier of 20 (20 ÷ 1 = 20). Multiplying 2 × 20 = 40 cups (Ratio 2 : 1 = 40 : 20).",
    "studioActionText": "Stagehands finish painting the bright green cyclorama wall!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 20,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 20,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 50,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q45_set_wall_construction",
    "stage": 5,
    "title": "Stage 5: Set Wall Construction",
    "scenario": "Set Wall Construction on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plywood Flats to Timber Braces is 2 : 1. If there are 16 Plywood Flats, how many Timber Braces are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "Plywood Flats",
    "labelB": "Timber Braces",
    "targetQuantityName": "Timber Braces",
    "givenQuantityName": "Plywood Flats",
    "givenQuantityValue": 16,
    "correctAnswer": 8,
    "correctUnit": "pieces",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "16 Plywood Flats represents a scale multiplier of 8 (16 ÷ 2 = 8). Multiplying 1 × 8 = 8 pieces (Ratio 2 : 1 = 16 : 8).",
    "studioActionText": "Carpenters assemble the grand studio set walls!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 8,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q46_set_wall_construction",
    "stage": 1,
    "title": "Stage 1: Set Wall Construction",
    "scenario": "Set Wall Construction on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plywood Flats to Timber Braces is 3 : 1. If there are 12 Timber Braces, how many Plywood Flats are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "Plywood Flats",
    "labelB": "Timber Braces",
    "targetQuantityName": "Plywood Flats",
    "givenQuantityName": "Timber Braces",
    "givenQuantityValue": 12,
    "correctAnswer": 36,
    "correctUnit": "pieces",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "12 Timber Braces represents a scale multiplier of 12 (12 ÷ 1 = 12). Multiplying 3 × 12 = 36 pieces (Ratio 3 : 1 = 36 : 12).",
    "studioActionText": "Carpenters assemble the grand studio set walls!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 12,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q47_set_wall_construction",
    "stage": 2,
    "title": "Stage 2: Set Wall Construction",
    "scenario": "Set Wall Construction on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plywood Flats to Timber Braces is 3 : 2. If there are 6 Plywood Flats, how many Timber Braces are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Plywood Flats",
    "labelB": "Timber Braces",
    "targetQuantityName": "Timber Braces",
    "givenQuantityName": "Plywood Flats",
    "givenQuantityValue": 6,
    "correctAnswer": 4,
    "correctUnit": "pieces",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "6 Plywood Flats represents a scale multiplier of 2 (6 ÷ 3 = 2). Multiplying 2 × 2 = 4 pieces (Ratio 3 : 2 = 6 : 4).",
    "studioActionText": "Carpenters assemble the grand studio set walls!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 2,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q48_set_wall_construction",
    "stage": 3,
    "title": "Stage 3: Set Wall Construction",
    "scenario": "Set Wall Construction on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plywood Flats to Timber Braces is 4 : 1. If there are 5 Timber Braces, how many Plywood Flats are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Plywood Flats",
    "labelB": "Timber Braces",
    "targetQuantityName": "Plywood Flats",
    "givenQuantityName": "Timber Braces",
    "givenQuantityValue": 5,
    "correctAnswer": 20,
    "correctUnit": "pieces",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "5 Timber Braces represents a scale multiplier of 5 (5 ÷ 1 = 5). Multiplying 4 × 5 = 20 pieces (Ratio 4 : 1 = 20 : 5).",
    "studioActionText": "Carpenters assemble the grand studio set walls!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 5,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q49_backdrop_fabric_drapes",
    "stage": 4,
    "title": "Stage 4: Backdrop Fabric Drapes",
    "scenario": "Backdrop Fabric Drapes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Velvet Drapes (m) to Satin Sheeting (m) is 4 : 1. If there are 60 Velvet Drapes (m), how many Satin Sheeting (m) are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Velvet Drapes (m)",
    "labelB": "Satin Sheeting (m)",
    "targetQuantityName": "Satin Sheeting (m)",
    "givenQuantityName": "Velvet Drapes (m)",
    "givenQuantityValue": 60,
    "correctAnswer": 15,
    "correctUnit": "meters",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "60 Velvet Drapes (m) represents a scale multiplier of 15 (60 ÷ 4 = 15). Multiplying 1 × 15 = 15 meters (Ratio 4 : 1 = 60 : 15).",
    "studioActionText": "Set Decorators hang floor-to-ceiling acoustic drapes!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 15,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q50_backdrop_fabric_drapes",
    "stage": 5,
    "title": "Stage 5: Backdrop Fabric Drapes",
    "scenario": "Backdrop Fabric Drapes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Velvet Drapes (m) to Satin Sheeting (m) is 5 : 2. If there are 6 Satin Sheeting (m), how many Velvet Drapes (m) are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Velvet Drapes (m)",
    "labelB": "Satin Sheeting (m)",
    "targetQuantityName": "Velvet Drapes (m)",
    "givenQuantityName": "Satin Sheeting (m)",
    "givenQuantityValue": 6,
    "correctAnswer": 15,
    "correctUnit": "meters",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "6 Satin Sheeting (m) represents a scale multiplier of 3 (6 ÷ 2 = 3). Multiplying 5 × 3 = 15 meters (Ratio 5 : 2 = 15 : 6).",
    "studioActionText": "Set Decorators hang floor-to-ceiling acoustic drapes!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 3,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q51_backdrop_fabric_drapes",
    "stage": 1,
    "title": "Stage 1: Backdrop Fabric Drapes",
    "scenario": "Backdrop Fabric Drapes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Velvet Drapes (m) to Satin Sheeting (m) is 4 : 3. If there are 24 Velvet Drapes (m), how many Satin Sheeting (m) are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Velvet Drapes (m)",
    "labelB": "Satin Sheeting (m)",
    "targetQuantityName": "Satin Sheeting (m)",
    "givenQuantityName": "Velvet Drapes (m)",
    "givenQuantityValue": 24,
    "correctAnswer": 18,
    "correctUnit": "meters",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "24 Velvet Drapes (m) represents a scale multiplier of 6 (24 ÷ 4 = 6). Multiplying 3 × 6 = 18 meters (Ratio 4 : 3 = 24 : 18).",
    "studioActionText": "Set Decorators hang floor-to-ceiling acoustic drapes!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 6,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q52_backdrop_fabric_drapes",
    "stage": 2,
    "title": "Stage 2: Backdrop Fabric Drapes",
    "scenario": "Backdrop Fabric Drapes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Velvet Drapes (m) to Satin Sheeting (m) is 5 : 3. If there are 27 Satin Sheeting (m), how many Velvet Drapes (m) are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Velvet Drapes (m)",
    "labelB": "Satin Sheeting (m)",
    "targetQuantityName": "Velvet Drapes (m)",
    "givenQuantityName": "Satin Sheeting (m)",
    "givenQuantityValue": 27,
    "correctAnswer": 45,
    "correctUnit": "meters",
    "options": [
      23,
      34,
      45,
      56
    ],
    "unitRateExplanation": "27 Satin Sheeting (m) represents a scale multiplier of 9 (27 ÷ 3 = 9). Multiplying 5 × 9 = 45 meters (Ratio 5 : 3 = 45 : 27).",
    "studioActionText": "Set Decorators hang floor-to-ceiling acoustic drapes!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 9,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 23,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 56,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q53_floor_stage_tape",
    "stage": 3,
    "title": "Stage 3: Floor Stage Tape",
    "scenario": "Floor Stage Tape on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Yellow Hazard Tape (m) to Blue Actor Marks (m) is 5 : 3. If there are 20 Yellow Hazard Tape (m), how many Blue Actor Marks (m) are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Yellow Hazard Tape (m)",
    "labelB": "Blue Actor Marks (m)",
    "targetQuantityName": "Blue Actor Marks (m)",
    "givenQuantityName": "Yellow Hazard Tape (m)",
    "givenQuantityValue": 20,
    "correctAnswer": 12,
    "correctUnit": "meters",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "20 Yellow Hazard Tape (m) represents a scale multiplier of 4 (20 ÷ 5 = 4). Multiplying 3 × 4 = 12 meters (Ratio 5 : 3 = 20 : 12).",
    "studioActionText": "Assistant Director lays down precise blocking marks!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 4,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q54_floor_stage_tape",
    "stage": 4,
    "title": "Stage 4: Floor Stage Tape",
    "scenario": "Floor Stage Tape on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Yellow Hazard Tape (m) to Blue Actor Marks (m) is 7 : 2. If there are 14 Blue Actor Marks (m), how many Yellow Hazard Tape (m) are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Yellow Hazard Tape (m)",
    "labelB": "Blue Actor Marks (m)",
    "targetQuantityName": "Yellow Hazard Tape (m)",
    "givenQuantityName": "Blue Actor Marks (m)",
    "givenQuantityValue": 14,
    "correctAnswer": 49,
    "correctUnit": "meters",
    "options": [
      25,
      37,
      49,
      61
    ],
    "unitRateExplanation": "14 Blue Actor Marks (m) represents a scale multiplier of 7 (14 ÷ 2 = 7). Multiplying 7 × 7 = 49 meters (Ratio 7 : 2 = 49 : 14).",
    "studioActionText": "Assistant Director lays down precise blocking marks!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 7,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 25,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 61,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q55_floor_stage_tape",
    "stage": 5,
    "title": "Stage 5: Floor Stage Tape",
    "scenario": "Floor Stage Tape on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Yellow Hazard Tape (m) to Blue Actor Marks (m) is 1 : 6. If there are 10 Yellow Hazard Tape (m), how many Blue Actor Marks (m) are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "Yellow Hazard Tape (m)",
    "labelB": "Blue Actor Marks (m)",
    "targetQuantityName": "Blue Actor Marks (m)",
    "givenQuantityName": "Yellow Hazard Tape (m)",
    "givenQuantityValue": 10,
    "correctAnswer": 60,
    "correctUnit": "meters",
    "options": [
      30,
      45,
      60,
      75
    ],
    "unitRateExplanation": "10 Yellow Hazard Tape (m) represents a scale multiplier of 10 (10 ÷ 1 = 10). Multiplying 6 × 10 = 60 meters (Ratio 1 : 6 = 10 : 60).",
    "studioActionText": "Assistant Director lays down precise blocking marks!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 10,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 30,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 75,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q56_floor_stage_tape",
    "stage": 1,
    "title": "Stage 1: Floor Stage Tape",
    "scenario": "Floor Stage Tape on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Yellow Hazard Tape (m) to Blue Actor Marks (m) is 2 : 9. If there are 180 Blue Actor Marks (m), how many Yellow Hazard Tape (m) are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "Yellow Hazard Tape (m)",
    "labelB": "Blue Actor Marks (m)",
    "targetQuantityName": "Yellow Hazard Tape (m)",
    "givenQuantityName": "Blue Actor Marks (m)",
    "givenQuantityValue": 180,
    "correctAnswer": 40,
    "correctUnit": "meters",
    "options": [
      20,
      30,
      40,
      50
    ],
    "unitRateExplanation": "180 Blue Actor Marks (m) represents a scale multiplier of 20 (180 ÷ 9 = 20). Multiplying 2 × 20 = 40 meters (Ratio 2 : 9 = 40 : 180).",
    "studioActionText": "Assistant Director lays down precise blocking marks!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 20,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 20,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 50,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q57_plaster_mold_mixture",
    "stage": 2,
    "title": "Stage 2: Plaster Mold Mixture",
    "scenario": "Plaster Mold Mixture on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plaster Powder (kg) to Water (liters) is 2 : 9. If there are 16 Plaster Powder (kg), how many Water (liters) are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "Plaster Powder (kg)",
    "labelB": "Water (liters)",
    "targetQuantityName": "Water (liters)",
    "givenQuantityName": "Plaster Powder (kg)",
    "givenQuantityValue": 16,
    "correctAnswer": 72,
    "correctUnit": "liters",
    "options": [
      36,
      54,
      72,
      90
    ],
    "unitRateExplanation": "16 Plaster Powder (kg) represents a scale multiplier of 8 (16 ÷ 2 = 8). Multiplying 9 × 8 = 72 liters (Ratio 2 : 9 = 16 : 72).",
    "studioActionText": "Sculptors cast architectural pillars for the palace set!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 8,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 36,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 90,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q58_plaster_mold_mixture",
    "stage": 3,
    "title": "Stage 3: Plaster Mold Mixture",
    "scenario": "Plaster Mold Mixture on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plaster Powder (kg) to Water (liters) is 3 : 8. If there are 96 Water (liters), how many Plaster Powder (kg) are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "Plaster Powder (kg)",
    "labelB": "Water (liters)",
    "targetQuantityName": "Plaster Powder (kg)",
    "givenQuantityName": "Water (liters)",
    "givenQuantityValue": 96,
    "correctAnswer": 36,
    "correctUnit": "liters",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "96 Water (liters) represents a scale multiplier of 12 (96 ÷ 8 = 12). Multiplying 3 × 12 = 36 liters (Ratio 3 : 8 = 36 : 96).",
    "studioActionText": "Sculptors cast architectural pillars for the palace set!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 12,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q59_plaster_mold_mixture",
    "stage": 4,
    "title": "Stage 4: Plaster Mold Mixture",
    "scenario": "Plaster Mold Mixture on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plaster Powder (kg) to Water (liters) is 1 : 2. If there are 2 Plaster Powder (kg), how many Water (liters) are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Plaster Powder (kg)",
    "labelB": "Water (liters)",
    "targetQuantityName": "Water (liters)",
    "givenQuantityName": "Plaster Powder (kg)",
    "givenQuantityValue": 2,
    "correctAnswer": 4,
    "correctUnit": "liters",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "2 Plaster Powder (kg) represents a scale multiplier of 2 (2 ÷ 1 = 2). Multiplying 2 × 2 = 4 liters (Ratio 1 : 2 = 2 : 4).",
    "studioActionText": "Sculptors cast architectural pillars for the palace set!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 2,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q60_plaster_mold_mixture",
    "stage": 5,
    "title": "Stage 5: Plaster Mold Mixture",
    "scenario": "Plaster Mold Mixture on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Plaster Powder (kg) to Water (liters) is 1 : 3. If there are 15 Water (liters), how many Plaster Powder (kg) are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Plaster Powder (kg)",
    "labelB": "Water (liters)",
    "targetQuantityName": "Plaster Powder (kg)",
    "givenQuantityName": "Water (liters)",
    "givenQuantityValue": 15,
    "correctAnswer": 5,
    "correctUnit": "liters",
    "options": [
      3,
      4,
      5,
      6
    ],
    "unitRateExplanation": "15 Water (liters) represents a scale multiplier of 5 (15 ÷ 3 = 5). Multiplying 1 × 5 = 5 liters (Ratio 1 : 3 = 5 : 15).",
    "studioActionText": "Sculptors cast architectural pillars for the palace set!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 5,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 6,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q61_superhero_cape_velvet",
    "stage": 1,
    "title": "Stage 1: Superhero Cape Velvet",
    "scenario": "Superhero Cape Velvet on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silk Lining (m) to Crimson Velvet (m) is 3 : 2. If there are 15 Silk Lining (m), how many Crimson Velvet (m) are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Silk Lining (m)",
    "labelB": "Crimson Velvet (m)",
    "targetQuantityName": "Crimson Velvet (m)",
    "givenQuantityName": "Silk Lining (m)",
    "givenQuantityValue": 15,
    "correctAnswer": 10,
    "correctUnit": "meters",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "15 Silk Lining (m) represents a scale multiplier of 5 (15 ÷ 3 = 5). Multiplying 2 × 5 = 10 meters (Ratio 3 : 2 = 15 : 10).",
    "studioActionText": "Costume Designer tailors the hero flowing cape!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 5,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q62_superhero_cape_velvet",
    "stage": 2,
    "title": "Stage 2: Superhero Cape Velvet",
    "scenario": "Superhero Cape Velvet on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silk Lining (m) to Crimson Velvet (m) is 4 : 1. If there are 8 Crimson Velvet (m), how many Silk Lining (m) are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Silk Lining (m)",
    "labelB": "Crimson Velvet (m)",
    "targetQuantityName": "Silk Lining (m)",
    "givenQuantityName": "Crimson Velvet (m)",
    "givenQuantityValue": 8,
    "correctAnswer": 32,
    "correctUnit": "meters",
    "options": [
      16,
      24,
      32,
      40
    ],
    "unitRateExplanation": "8 Crimson Velvet (m) represents a scale multiplier of 8 (8 ÷ 1 = 8). Multiplying 4 × 8 = 32 meters (Ratio 4 : 1 = 32 : 8).",
    "studioActionText": "Costume Designer tailors the hero flowing cape!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 8,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 16,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 40,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q63_superhero_cape_velvet",
    "stage": 3,
    "title": "Stage 3: Superhero Cape Velvet",
    "scenario": "Superhero Cape Velvet on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silk Lining (m) to Crimson Velvet (m) is 5 : 2. If there are 60 Silk Lining (m), how many Crimson Velvet (m) are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Silk Lining (m)",
    "labelB": "Crimson Velvet (m)",
    "targetQuantityName": "Crimson Velvet (m)",
    "givenQuantityName": "Silk Lining (m)",
    "givenQuantityValue": 60,
    "correctAnswer": 24,
    "correctUnit": "meters",
    "options": [
      12,
      18,
      24,
      30
    ],
    "unitRateExplanation": "60 Silk Lining (m) represents a scale multiplier of 12 (60 ÷ 5 = 12). Multiplying 2 × 12 = 24 meters (Ratio 5 : 2 = 60 : 24).",
    "studioActionText": "Costume Designer tailors the hero flowing cape!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 12,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 12,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 30,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q64_superhero_cape_velvet",
    "stage": 4,
    "title": "Stage 4: Superhero Cape Velvet",
    "scenario": "Superhero Cape Velvet on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silk Lining (m) to Crimson Velvet (m) is 4 : 3. If there are 6 Crimson Velvet (m), how many Silk Lining (m) are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Silk Lining (m)",
    "labelB": "Crimson Velvet (m)",
    "targetQuantityName": "Silk Lining (m)",
    "givenQuantityName": "Crimson Velvet (m)",
    "givenQuantityValue": 6,
    "correctAnswer": 8,
    "correctUnit": "meters",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "6 Crimson Velvet (m) represents a scale multiplier of 2 (6 ÷ 3 = 2). Multiplying 4 × 2 = 8 meters (Ratio 4 : 3 = 8 : 6).",
    "studioActionText": "Costume Designer tailors the hero flowing cape!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 2,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q65_sequins_spangles",
    "stage": 5,
    "title": "Stage 5: Sequins & Spangles",
    "scenario": "Sequins & Spangles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Sequins (packs) to Silver Sequins (packs) is 4 : 3. If there are 36 Gold Sequins (packs), how many Silver Sequins (packs) are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Gold Sequins (packs)",
    "labelB": "Silver Sequins (packs)",
    "targetQuantityName": "Silver Sequins (packs)",
    "givenQuantityName": "Gold Sequins (packs)",
    "givenQuantityValue": 36,
    "correctAnswer": 27,
    "correctUnit": "packs",
    "options": [
      14,
      20,
      27,
      34
    ],
    "unitRateExplanation": "36 Gold Sequins (packs) represents a scale multiplier of 9 (36 ÷ 4 = 9). Multiplying 3 × 9 = 27 packs (Ratio 4 : 3 = 36 : 27).",
    "studioActionText": "Wardrobe Department embroiders the gala banquet gown!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 9,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 14,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 34,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q66_sequins_spangles",
    "stage": 1,
    "title": "Stage 1: Sequins & Spangles",
    "scenario": "Sequins & Spangles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Sequins (packs) to Silver Sequins (packs) is 5 : 3. If there are 45 Silver Sequins (packs), how many Gold Sequins (packs) are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Gold Sequins (packs)",
    "labelB": "Silver Sequins (packs)",
    "targetQuantityName": "Gold Sequins (packs)",
    "givenQuantityName": "Silver Sequins (packs)",
    "givenQuantityValue": 45,
    "correctAnswer": 75,
    "correctUnit": "packs",
    "options": [
      38,
      56,
      75,
      94
    ],
    "unitRateExplanation": "45 Silver Sequins (packs) represents a scale multiplier of 15 (45 ÷ 3 = 15). Multiplying 5 × 15 = 75 packs (Ratio 5 : 3 = 75 : 45).",
    "studioActionText": "Wardrobe Department embroiders the gala banquet gown!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 15,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 38,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 94,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q67_sequins_spangles",
    "stage": 2,
    "title": "Stage 2: Sequins & Spangles",
    "scenario": "Sequins & Spangles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Sequins (packs) to Silver Sequins (packs) is 7 : 2. If there are 21 Gold Sequins (packs), how many Silver Sequins (packs) are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Gold Sequins (packs)",
    "labelB": "Silver Sequins (packs)",
    "targetQuantityName": "Silver Sequins (packs)",
    "givenQuantityName": "Gold Sequins (packs)",
    "givenQuantityValue": 21,
    "correctAnswer": 6,
    "correctUnit": "packs",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "21 Gold Sequins (packs) represents a scale multiplier of 3 (21 ÷ 7 = 3). Multiplying 2 × 3 = 6 packs (Ratio 7 : 2 = 21 : 6).",
    "studioActionText": "Wardrobe Department embroiders the gala banquet gown!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 3,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q68_sequins_spangles",
    "stage": 3,
    "title": "Stage 3: Sequins & Spangles",
    "scenario": "Sequins & Spangles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Sequins (packs) to Silver Sequins (packs) is 1 : 6. If there are 36 Silver Sequins (packs), how many Gold Sequins (packs) are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "Gold Sequins (packs)",
    "labelB": "Silver Sequins (packs)",
    "targetQuantityName": "Gold Sequins (packs)",
    "givenQuantityName": "Silver Sequins (packs)",
    "givenQuantityValue": 36,
    "correctAnswer": 6,
    "correctUnit": "packs",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "36 Silver Sequins (packs) represents a scale multiplier of 6 (36 ÷ 6 = 6). Multiplying 1 × 6 = 6 packs (Ratio 1 : 6 = 6 : 36).",
    "studioActionText": "Wardrobe Department embroiders the gala banquet gown!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 6,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q69_armor_rivet_spacing",
    "stage": 4,
    "title": "Stage 4: Armor Rivet Spacing",
    "scenario": "Armor Rivet Spacing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Brass Studs to Steel Rivets is 1 : 6. If there are 20 Brass Studs, how many Steel Rivets are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "Brass Studs",
    "labelB": "Steel Rivets",
    "targetQuantityName": "Steel Rivets",
    "givenQuantityName": "Brass Studs",
    "givenQuantityValue": 20,
    "correctAnswer": 120,
    "correctUnit": "rivets",
    "options": [
      60,
      90,
      120,
      150
    ],
    "unitRateExplanation": "20 Brass Studs represents a scale multiplier of 20 (20 ÷ 1 = 20). Multiplying 6 × 20 = 120 rivets (Ratio 1 : 6 = 20 : 120).",
    "studioActionText": "Armorer secures the knight breastplate fasteners!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 20,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 60,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 150,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q70_armor_rivet_spacing",
    "stage": 5,
    "title": "Stage 5: Armor Rivet Spacing",
    "scenario": "Armor Rivet Spacing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Brass Studs to Steel Rivets is 2 : 9. If there are 36 Steel Rivets, how many Brass Studs are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "Brass Studs",
    "labelB": "Steel Rivets",
    "targetQuantityName": "Brass Studs",
    "givenQuantityName": "Steel Rivets",
    "givenQuantityValue": 36,
    "correctAnswer": 8,
    "correctUnit": "rivets",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "36 Steel Rivets represents a scale multiplier of 4 (36 ÷ 9 = 4). Multiplying 2 × 4 = 8 rivets (Ratio 2 : 9 = 8 : 36).",
    "studioActionText": "Armorer secures the knight breastplate fasteners!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 4,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q71_armor_rivet_spacing",
    "stage": 1,
    "title": "Stage 1: Armor Rivet Spacing",
    "scenario": "Armor Rivet Spacing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Brass Studs to Steel Rivets is 3 : 8. If there are 21 Brass Studs, how many Steel Rivets are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "Brass Studs",
    "labelB": "Steel Rivets",
    "targetQuantityName": "Steel Rivets",
    "givenQuantityName": "Brass Studs",
    "givenQuantityValue": 21,
    "correctAnswer": 56,
    "correctUnit": "rivets",
    "options": [
      28,
      42,
      56,
      70
    ],
    "unitRateExplanation": "21 Brass Studs represents a scale multiplier of 7 (21 ÷ 3 = 7). Multiplying 8 × 7 = 56 rivets (Ratio 3 : 8 = 21 : 56).",
    "studioActionText": "Armorer secures the knight breastplate fasteners!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 7,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 28,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 70,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q72_armor_rivet_spacing",
    "stage": 2,
    "title": "Stage 2: Armor Rivet Spacing",
    "scenario": "Armor Rivet Spacing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Brass Studs to Steel Rivets is 1 : 2. If there are 20 Steel Rivets, how many Brass Studs are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Brass Studs",
    "labelB": "Steel Rivets",
    "targetQuantityName": "Brass Studs",
    "givenQuantityName": "Steel Rivets",
    "givenQuantityValue": 20,
    "correctAnswer": 10,
    "correctUnit": "rivets",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "20 Steel Rivets represents a scale multiplier of 10 (20 ÷ 2 = 10). Multiplying 1 × 10 = 10 rivets (Ratio 1 : 2 = 10 : 20).",
    "studioActionText": "Armorer secures the knight breastplate fasteners!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 10,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q73_vintage_fabric_dyes",
    "stage": 3,
    "title": "Stage 3: Vintage Fabric Dyes",
    "scenario": "Vintage Fabric Dyes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Indigo Pigment (oz) to Fixer Solution (oz) is 1 : 2. If there are 5 Indigo Pigment (oz), how many Fixer Solution (oz) are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Indigo Pigment (oz)",
    "labelB": "Fixer Solution (oz)",
    "targetQuantityName": "Fixer Solution (oz)",
    "givenQuantityName": "Indigo Pigment (oz)",
    "givenQuantityValue": 5,
    "correctAnswer": 10,
    "correctUnit": "ounces",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "5 Indigo Pigment (oz) represents a scale multiplier of 5 (5 ÷ 1 = 5). Multiplying 2 × 5 = 10 ounces (Ratio 1 : 2 = 5 : 10).",
    "studioActionText": "Textile Artist ages period-accurate costume fabrics!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 5,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q74_vintage_fabric_dyes",
    "stage": 4,
    "title": "Stage 4: Vintage Fabric Dyes",
    "scenario": "Vintage Fabric Dyes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Indigo Pigment (oz) to Fixer Solution (oz) is 1 : 3. If there are 24 Fixer Solution (oz), how many Indigo Pigment (oz) are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Indigo Pigment (oz)",
    "labelB": "Fixer Solution (oz)",
    "targetQuantityName": "Indigo Pigment (oz)",
    "givenQuantityName": "Fixer Solution (oz)",
    "givenQuantityValue": 24,
    "correctAnswer": 8,
    "correctUnit": "ounces",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "24 Fixer Solution (oz) represents a scale multiplier of 8 (24 ÷ 3 = 8). Multiplying 1 × 8 = 8 ounces (Ratio 1 : 3 = 8 : 24).",
    "studioActionText": "Textile Artist ages period-accurate costume fabrics!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 8,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q75_vintage_fabric_dyes",
    "stage": 5,
    "title": "Stage 5: Vintage Fabric Dyes",
    "scenario": "Vintage Fabric Dyes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Indigo Pigment (oz) to Fixer Solution (oz) is 1 : 4. If there are 12 Indigo Pigment (oz), how many Fixer Solution (oz) are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "Indigo Pigment (oz)",
    "labelB": "Fixer Solution (oz)",
    "targetQuantityName": "Fixer Solution (oz)",
    "givenQuantityName": "Indigo Pigment (oz)",
    "givenQuantityValue": 12,
    "correctAnswer": 48,
    "correctUnit": "ounces",
    "options": [
      24,
      36,
      48,
      60
    ],
    "unitRateExplanation": "12 Indigo Pigment (oz) represents a scale multiplier of 12 (12 ÷ 1 = 12). Multiplying 4 × 12 = 48 ounces (Ratio 1 : 4 = 12 : 48).",
    "studioActionText": "Textile Artist ages period-accurate costume fabrics!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 12,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 24,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 60,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q76_vintage_fabric_dyes",
    "stage": 1,
    "title": "Stage 1: Vintage Fabric Dyes",
    "scenario": "Vintage Fabric Dyes on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Indigo Pigment (oz) to Fixer Solution (oz) is 1 : 5. If there are 10 Fixer Solution (oz), how many Indigo Pigment (oz) are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Indigo Pigment (oz)",
    "labelB": "Fixer Solution (oz)",
    "targetQuantityName": "Indigo Pigment (oz)",
    "givenQuantityName": "Fixer Solution (oz)",
    "givenQuantityValue": 10,
    "correctAnswer": 2,
    "correctUnit": "ounces",
    "options": [
      1,
      2,
      3,
      5
    ],
    "unitRateExplanation": "10 Fixer Solution (oz) represents a scale multiplier of 2 (10 ÷ 5 = 2). Multiplying 1 × 2 = 2 ounces (Ratio 1 : 5 = 2 : 10).",
    "studioActionText": "Textile Artist ages period-accurate costume fabrics!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 2,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 1,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q77_boot_leather_stitching",
    "stage": 2,
    "title": "Stage 2: Boot Leather Stitching",
    "scenario": "Boot Leather Stitching on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Thread Spools to Leather Soles is 1 : 5. If there are 9 Thread Spools, how many Leather Soles are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Thread Spools",
    "labelB": "Leather Soles",
    "targetQuantityName": "Leather Soles",
    "givenQuantityName": "Thread Spools",
    "givenQuantityValue": 9,
    "correctAnswer": 45,
    "correctUnit": "spools",
    "options": [
      23,
      34,
      45,
      56
    ],
    "unitRateExplanation": "9 Thread Spools represents a scale multiplier of 9 (9 ÷ 1 = 9). Multiplying 5 × 9 = 45 spools (Ratio 1 : 5 = 9 : 45).",
    "studioActionText": "Cobbler crafts durable action stunt boots for the lead!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 9,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 23,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 56,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q78_boot_leather_stitching",
    "stage": 3,
    "title": "Stage 3: Boot Leather Stitching",
    "scenario": "Boot Leather Stitching on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Thread Spools to Leather Soles is 2 : 3. If there are 45 Leather Soles, how many Thread Spools are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "Thread Spools",
    "labelB": "Leather Soles",
    "targetQuantityName": "Thread Spools",
    "givenQuantityName": "Leather Soles",
    "givenQuantityValue": 45,
    "correctAnswer": 30,
    "correctUnit": "spools",
    "options": [
      15,
      23,
      30,
      38
    ],
    "unitRateExplanation": "45 Leather Soles represents a scale multiplier of 15 (45 ÷ 3 = 15). Multiplying 2 × 15 = 30 spools (Ratio 2 : 3 = 30 : 45).",
    "studioActionText": "Cobbler crafts durable action stunt boots for the lead!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 15,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 15,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 38,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q79_boot_leather_stitching",
    "stage": 4,
    "title": "Stage 4: Boot Leather Stitching",
    "scenario": "Boot Leather Stitching on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Thread Spools to Leather Soles is 2 : 5. If there are 6 Thread Spools, how many Leather Soles are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "Thread Spools",
    "labelB": "Leather Soles",
    "targetQuantityName": "Leather Soles",
    "givenQuantityName": "Thread Spools",
    "givenQuantityValue": 6,
    "correctAnswer": 15,
    "correctUnit": "spools",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "6 Thread Spools represents a scale multiplier of 3 (6 ÷ 2 = 3). Multiplying 5 × 3 = 15 spools (Ratio 2 : 5 = 6 : 15).",
    "studioActionText": "Cobbler crafts durable action stunt boots for the lead!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 3,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q80_boot_leather_stitching",
    "stage": 5,
    "title": "Stage 5: Boot Leather Stitching",
    "scenario": "Boot Leather Stitching on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Thread Spools to Leather Soles is 3 : 4. If there are 24 Leather Soles, how many Thread Spools are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Thread Spools",
    "labelB": "Leather Soles",
    "targetQuantityName": "Thread Spools",
    "givenQuantityName": "Leather Soles",
    "givenQuantityValue": 24,
    "correctAnswer": 18,
    "correctUnit": "spools",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "24 Leather Soles represents a scale multiplier of 6 (24 ÷ 4 = 6). Multiplying 3 × 6 = 18 spools (Ratio 3 : 4 = 18 : 24).",
    "studioActionText": "Cobbler crafts durable action stunt boots for the lead!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 6,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q81_slow_motion_action_stunt",
    "stage": 1,
    "title": "Stage 1: Slow-Motion Action Stunt",
    "scenario": "Slow-Motion Action Stunt on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Real Seconds (s) to Slow-Mo Seconds (s) is 7 : 2. If there are 42 Real Seconds (s), how many Slow-Mo Seconds (s) are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Real Seconds (s)",
    "labelB": "Slow-Mo Seconds (s)",
    "targetQuantityName": "Slow-Mo Seconds (s)",
    "givenQuantityName": "Real Seconds (s)",
    "givenQuantityValue": 42,
    "correctAnswer": 12,
    "correctUnit": "seconds",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "42 Real Seconds (s) represents a scale multiplier of 6 (42 ÷ 7 = 6). Multiplying 2 × 6 = 12 seconds (Ratio 7 : 2 = 42 : 12).",
    "studioActionText": "Lighting Technicians illuminate the stage for the big stunt take!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 6,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q82_slow_motion_action_stunt",
    "stage": 2,
    "title": "Stage 2: Slow-Motion Action Stunt",
    "scenario": "Slow-Motion Action Stunt on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Real Seconds (s) to Slow-Mo Seconds (s) is 1 : 6. If there are 54 Slow-Mo Seconds (s), how many Real Seconds (s) are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "Real Seconds (s)",
    "labelB": "Slow-Mo Seconds (s)",
    "targetQuantityName": "Real Seconds (s)",
    "givenQuantityName": "Slow-Mo Seconds (s)",
    "givenQuantityValue": 54,
    "correctAnswer": 9,
    "correctUnit": "seconds",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "54 Slow-Mo Seconds (s) represents a scale multiplier of 9 (54 ÷ 6 = 9). Multiplying 1 × 9 = 9 seconds (Ratio 1 : 6 = 9 : 54).",
    "studioActionText": "Lighting Technicians illuminate the stage for the big stunt take!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 9,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q83_slow_motion_action_stunt",
    "stage": 3,
    "title": "Stage 3: Slow-Motion Action Stunt",
    "scenario": "Slow-Motion Action Stunt on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Real Seconds (s) to Slow-Mo Seconds (s) is 2 : 9. If there are 30 Real Seconds (s), how many Slow-Mo Seconds (s) are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "Real Seconds (s)",
    "labelB": "Slow-Mo Seconds (s)",
    "targetQuantityName": "Slow-Mo Seconds (s)",
    "givenQuantityName": "Real Seconds (s)",
    "givenQuantityValue": 30,
    "correctAnswer": 135,
    "correctUnit": "seconds",
    "options": [
      68,
      101,
      135,
      169
    ],
    "unitRateExplanation": "30 Real Seconds (s) represents a scale multiplier of 15 (30 ÷ 2 = 15). Multiplying 9 × 15 = 135 seconds (Ratio 2 : 9 = 30 : 135).",
    "studioActionText": "Lighting Technicians illuminate the stage for the big stunt take!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 15,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 68,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 169,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q84_slow_motion_action_stunt",
    "stage": 4,
    "title": "Stage 4: Slow-Motion Action Stunt",
    "scenario": "Slow-Motion Action Stunt on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Real Seconds (s) to Slow-Mo Seconds (s) is 3 : 8. If there are 24 Slow-Mo Seconds (s), how many Real Seconds (s) are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "Real Seconds (s)",
    "labelB": "Slow-Mo Seconds (s)",
    "targetQuantityName": "Real Seconds (s)",
    "givenQuantityName": "Slow-Mo Seconds (s)",
    "givenQuantityValue": 24,
    "correctAnswer": 9,
    "correctUnit": "seconds",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "24 Slow-Mo Seconds (s) represents a scale multiplier of 3 (24 ÷ 8 = 3). Multiplying 3 × 3 = 9 seconds (Ratio 3 : 8 = 9 : 24).",
    "studioActionText": "Lighting Technicians illuminate the stage for the big stunt take!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 3,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q85_atmospheric_fog_fluid",
    "stage": 5,
    "title": "Stage 5: Atmospheric Fog Fluid",
    "scenario": "Atmospheric Fog Fluid on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Glycerin (liters) to Distilled Water (liters) is 3 : 8. If there are 30 Glycerin (liters), how many Distilled Water (liters) are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "Glycerin (liters)",
    "labelB": "Distilled Water (liters)",
    "targetQuantityName": "Distilled Water (liters)",
    "givenQuantityName": "Glycerin (liters)",
    "givenQuantityValue": 30,
    "correctAnswer": 80,
    "correctUnit": "liters",
    "options": [
      40,
      60,
      80,
      100
    ],
    "unitRateExplanation": "30 Glycerin (liters) represents a scale multiplier of 10 (30 ÷ 3 = 10). Multiplying 8 × 10 = 80 liters (Ratio 3 : 8 = 30 : 80).",
    "studioActionText": "SFX Coordinator pumps rolling atmospheric mist across the stage!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 10,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 40,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 100,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q86_atmospheric_fog_fluid",
    "stage": 1,
    "title": "Stage 1: Atmospheric Fog Fluid",
    "scenario": "Atmospheric Fog Fluid on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Glycerin (liters) to Distilled Water (liters) is 1 : 2. If there are 40 Distilled Water (liters), how many Glycerin (liters) are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Glycerin (liters)",
    "labelB": "Distilled Water (liters)",
    "targetQuantityName": "Glycerin (liters)",
    "givenQuantityName": "Distilled Water (liters)",
    "givenQuantityValue": 40,
    "correctAnswer": 20,
    "correctUnit": "liters",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "40 Distilled Water (liters) represents a scale multiplier of 20 (40 ÷ 2 = 20). Multiplying 1 × 20 = 20 liters (Ratio 1 : 2 = 20 : 40).",
    "studioActionText": "SFX Coordinator pumps rolling atmospheric mist across the stage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 20,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q87_atmospheric_fog_fluid",
    "stage": 2,
    "title": "Stage 2: Atmospheric Fog Fluid",
    "scenario": "Atmospheric Fog Fluid on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Glycerin (liters) to Distilled Water (liters) is 1 : 3. If there are 4 Glycerin (liters), how many Distilled Water (liters) are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Glycerin (liters)",
    "labelB": "Distilled Water (liters)",
    "targetQuantityName": "Distilled Water (liters)",
    "givenQuantityName": "Glycerin (liters)",
    "givenQuantityValue": 4,
    "correctAnswer": 12,
    "correctUnit": "liters",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "4 Glycerin (liters) represents a scale multiplier of 4 (4 ÷ 1 = 4). Multiplying 3 × 4 = 12 liters (Ratio 1 : 3 = 4 : 12).",
    "studioActionText": "SFX Coordinator pumps rolling atmospheric mist across the stage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 4,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q88_atmospheric_fog_fluid",
    "stage": 3,
    "title": "Stage 3: Atmospheric Fog Fluid",
    "scenario": "Atmospheric Fog Fluid on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Glycerin (liters) to Distilled Water (liters) is 1 : 4. If there are 28 Distilled Water (liters), how many Glycerin (liters) are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "Glycerin (liters)",
    "labelB": "Distilled Water (liters)",
    "targetQuantityName": "Glycerin (liters)",
    "givenQuantityName": "Distilled Water (liters)",
    "givenQuantityValue": 28,
    "correctAnswer": 7,
    "correctUnit": "liters",
    "options": [
      4,
      5,
      7,
      9
    ],
    "unitRateExplanation": "28 Distilled Water (liters) represents a scale multiplier of 7 (28 ÷ 4 = 7). Multiplying 1 × 7 = 7 liters (Ratio 1 : 4 = 7 : 28).",
    "studioActionText": "SFX Coordinator pumps rolling atmospheric mist across the stage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 7,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 9,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q89_safety_crash_pads",
    "stage": 4,
    "title": "Stage 4: Safety Crash Pads",
    "scenario": "Safety Crash Pads on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of High-Density Foam (m²) to Inflatable Mats (m²) is 1 : 4. If there are 2 High-Density Foam (m²), how many Inflatable Mats (m²) are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "High-Density Foam (m²)",
    "labelB": "Inflatable Mats (m²)",
    "targetQuantityName": "Inflatable Mats (m²)",
    "givenQuantityName": "High-Density Foam (m²)",
    "givenQuantityValue": 2,
    "correctAnswer": 8,
    "correctUnit": "m²",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "2 High-Density Foam (m²) represents a scale multiplier of 2 (2 ÷ 1 = 2). Multiplying 4 × 2 = 8 m² (Ratio 1 : 4 = 2 : 8).",
    "studioActionText": "Stunt Coordinator verifies fall cushions are secure!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 2,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q90_safety_crash_pads",
    "stage": 5,
    "title": "Stage 5: Safety Crash Pads",
    "scenario": "Safety Crash Pads on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of High-Density Foam (m²) to Inflatable Mats (m²) is 1 : 5. If there are 25 Inflatable Mats (m²), how many High-Density Foam (m²) are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "High-Density Foam (m²)",
    "labelB": "Inflatable Mats (m²)",
    "targetQuantityName": "High-Density Foam (m²)",
    "givenQuantityName": "Inflatable Mats (m²)",
    "givenQuantityValue": 25,
    "correctAnswer": 5,
    "correctUnit": "m²",
    "options": [
      3,
      4,
      5,
      6
    ],
    "unitRateExplanation": "25 Inflatable Mats (m²) represents a scale multiplier of 5 (25 ÷ 5 = 5). Multiplying 1 × 5 = 5 m² (Ratio 1 : 5 = 5 : 25).",
    "studioActionText": "Stunt Coordinator verifies fall cushions are secure!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 5,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 6,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q91_safety_crash_pads",
    "stage": 1,
    "title": "Stage 1: Safety Crash Pads",
    "scenario": "Safety Crash Pads on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of High-Density Foam (m²) to Inflatable Mats (m²) is 2 : 3. If there are 16 High-Density Foam (m²), how many Inflatable Mats (m²) are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "High-Density Foam (m²)",
    "labelB": "Inflatable Mats (m²)",
    "targetQuantityName": "Inflatable Mats (m²)",
    "givenQuantityName": "High-Density Foam (m²)",
    "givenQuantityValue": 16,
    "correctAnswer": 24,
    "correctUnit": "m²",
    "options": [
      12,
      18,
      24,
      30
    ],
    "unitRateExplanation": "16 High-Density Foam (m²) represents a scale multiplier of 8 (16 ÷ 2 = 8). Multiplying 3 × 8 = 24 m² (Ratio 2 : 3 = 16 : 24).",
    "studioActionText": "Stunt Coordinator verifies fall cushions are secure!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 8,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 12,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 30,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q92_safety_crash_pads",
    "stage": 2,
    "title": "Stage 2: Safety Crash Pads",
    "scenario": "Safety Crash Pads on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of High-Density Foam (m²) to Inflatable Mats (m²) is 2 : 5. If there are 60 Inflatable Mats (m²), how many High-Density Foam (m²) are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "High-Density Foam (m²)",
    "labelB": "Inflatable Mats (m²)",
    "targetQuantityName": "High-Density Foam (m²)",
    "givenQuantityName": "Inflatable Mats (m²)",
    "givenQuantityValue": 60,
    "correctAnswer": 24,
    "correctUnit": "m²",
    "options": [
      12,
      18,
      24,
      30
    ],
    "unitRateExplanation": "60 Inflatable Mats (m²) represents a scale multiplier of 12 (60 ÷ 5 = 12). Multiplying 2 × 12 = 24 m² (Ratio 2 : 5 = 24 : 60).",
    "studioActionText": "Stunt Coordinator verifies fall cushions are secure!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 12,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 12,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 30,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q93_breakaway_glass_bottles",
    "stage": 3,
    "title": "Stage 3: Breakaway Glass Bottles",
    "scenario": "Breakaway Glass Bottles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Sugar Glass Resin (kg) to Hardener (kg) is 2 : 5. If there are 12 Sugar Glass Resin (kg), how many Hardener (kg) are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "Sugar Glass Resin (kg)",
    "labelB": "Hardener (kg)",
    "targetQuantityName": "Hardener (kg)",
    "givenQuantityName": "Sugar Glass Resin (kg)",
    "givenQuantityValue": 12,
    "correctAnswer": 30,
    "correctUnit": "kg",
    "options": [
      15,
      23,
      30,
      38
    ],
    "unitRateExplanation": "12 Sugar Glass Resin (kg) represents a scale multiplier of 6 (12 ÷ 2 = 6). Multiplying 5 × 6 = 30 kg (Ratio 2 : 5 = 12 : 30).",
    "studioActionText": "Prop Dept bakes breakable bottles for the tavern fight!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 6,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 15,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 38,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q94_breakaway_glass_bottles",
    "stage": 4,
    "title": "Stage 4: Breakaway Glass Bottles",
    "scenario": "Breakaway Glass Bottles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Sugar Glass Resin (kg) to Hardener (kg) is 3 : 4. If there are 36 Hardener (kg), how many Sugar Glass Resin (kg) are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Sugar Glass Resin (kg)",
    "labelB": "Hardener (kg)",
    "targetQuantityName": "Sugar Glass Resin (kg)",
    "givenQuantityName": "Hardener (kg)",
    "givenQuantityValue": 36,
    "correctAnswer": 27,
    "correctUnit": "kg",
    "options": [
      14,
      20,
      27,
      34
    ],
    "unitRateExplanation": "36 Hardener (kg) represents a scale multiplier of 9 (36 ÷ 4 = 9). Multiplying 3 × 9 = 27 kg (Ratio 3 : 4 = 27 : 36).",
    "studioActionText": "Prop Dept bakes breakable bottles for the tavern fight!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 9,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 14,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 34,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q95_breakaway_glass_bottles",
    "stage": 5,
    "title": "Stage 5: Breakaway Glass Bottles",
    "scenario": "Breakaway Glass Bottles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Sugar Glass Resin (kg) to Hardener (kg) is 3 : 5. If there are 45 Sugar Glass Resin (kg), how many Hardener (kg) are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Sugar Glass Resin (kg)",
    "labelB": "Hardener (kg)",
    "targetQuantityName": "Hardener (kg)",
    "givenQuantityName": "Sugar Glass Resin (kg)",
    "givenQuantityValue": 45,
    "correctAnswer": 75,
    "correctUnit": "kg",
    "options": [
      38,
      56,
      75,
      94
    ],
    "unitRateExplanation": "45 Sugar Glass Resin (kg) represents a scale multiplier of 15 (45 ÷ 3 = 15). Multiplying 5 × 15 = 75 kg (Ratio 3 : 5 = 45 : 75).",
    "studioActionText": "Prop Dept bakes breakable bottles for the tavern fight!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 15,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 38,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 94,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q96_breakaway_glass_bottles",
    "stage": 1,
    "title": "Stage 1: Breakaway Glass Bottles",
    "scenario": "Breakaway Glass Bottles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Sugar Glass Resin (kg) to Hardener (kg) is 4 : 5. If there are 15 Hardener (kg), how many Sugar Glass Resin (kg) are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Sugar Glass Resin (kg)",
    "labelB": "Hardener (kg)",
    "targetQuantityName": "Sugar Glass Resin (kg)",
    "givenQuantityName": "Hardener (kg)",
    "givenQuantityValue": 15,
    "correctAnswer": 12,
    "correctUnit": "kg",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "15 Hardener (kg) represents a scale multiplier of 3 (15 ÷ 5 = 3). Multiplying 4 × 3 = 12 kg (Ratio 4 : 5 = 12 : 15).",
    "studioActionText": "Prop Dept bakes breakable bottles for the tavern fight!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 3,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q97_wire_stunt_rigging",
    "stage": 2,
    "title": "Stage 2: Wire Stunt Rigging",
    "scenario": "Wire Stunt Rigging on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Steel Cables to Counterweights (kg) is 4 : 5. If there are 40 Steel Cables, how many Counterweights (kg) are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Steel Cables",
    "labelB": "Counterweights (kg)",
    "targetQuantityName": "Counterweights (kg)",
    "givenQuantityName": "Steel Cables",
    "givenQuantityValue": 40,
    "correctAnswer": 50,
    "correctUnit": "kg",
    "options": [
      25,
      38,
      50,
      63
    ],
    "unitRateExplanation": "40 Steel Cables represents a scale multiplier of 10 (40 ÷ 4 = 10). Multiplying 5 × 10 = 50 kg (Ratio 4 : 5 = 40 : 50).",
    "studioActionText": "Rigging Crew tests aerial flying harness balances!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 10,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 25,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 63,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q98_wire_stunt_rigging",
    "stage": 3,
    "title": "Stage 3: Wire Stunt Rigging",
    "scenario": "Wire Stunt Rigging on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Steel Cables to Counterweights (kg) is 2 : 7. If there are 140 Counterweights (kg), how many Steel Cables are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Steel Cables",
    "labelB": "Counterweights (kg)",
    "targetQuantityName": "Steel Cables",
    "givenQuantityName": "Counterweights (kg)",
    "givenQuantityValue": 140,
    "correctAnswer": 40,
    "correctUnit": "kg",
    "options": [
      20,
      30,
      40,
      50
    ],
    "unitRateExplanation": "140 Counterweights (kg) represents a scale multiplier of 20 (140 ÷ 7 = 20). Multiplying 2 × 20 = 40 kg (Ratio 2 : 7 = 40 : 140).",
    "studioActionText": "Rigging Crew tests aerial flying harness balances!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 20,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 20,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 50,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q99_wire_stunt_rigging",
    "stage": 4,
    "title": "Stage 4: Wire Stunt Rigging",
    "scenario": "Wire Stunt Rigging on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Steel Cables to Counterweights (kg) is 3 : 7. If there are 12 Steel Cables, how many Counterweights (kg) are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Steel Cables",
    "labelB": "Counterweights (kg)",
    "targetQuantityName": "Counterweights (kg)",
    "givenQuantityName": "Steel Cables",
    "givenQuantityValue": 12,
    "correctAnswer": 28,
    "correctUnit": "kg",
    "options": [
      14,
      21,
      28,
      35
    ],
    "unitRateExplanation": "12 Steel Cables represents a scale multiplier of 4 (12 ÷ 3 = 4). Multiplying 7 × 4 = 28 kg (Ratio 3 : 7 = 12 : 28).",
    "studioActionText": "Rigging Crew tests aerial flying harness balances!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 4,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 14,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 35,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q100_wire_stunt_rigging",
    "stage": 5,
    "title": "Stage 5: Wire Stunt Rigging",
    "scenario": "Wire Stunt Rigging on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Steel Cables to Counterweights (kg) is 5 : 6. If there are 42 Counterweights (kg), how many Steel Cables are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Steel Cables",
    "labelB": "Counterweights (kg)",
    "targetQuantityName": "Steel Cables",
    "givenQuantityName": "Counterweights (kg)",
    "givenQuantityValue": 42,
    "correctAnswer": 35,
    "correctUnit": "kg",
    "options": [
      18,
      26,
      35,
      44
    ],
    "unitRateExplanation": "42 Counterweights (kg) represents a scale multiplier of 7 (42 ÷ 6 = 7). Multiplying 5 × 7 = 35 kg (Ratio 5 : 6 = 35 : 42).",
    "studioActionText": "Rigging Crew tests aerial flying harness balances!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 7,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 44,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q101_miniature_spaceship_prop",
    "stage": 1,
    "title": "Stage 1: Miniature Spaceship Prop",
    "scenario": "Miniature Spaceship Prop on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Mini Model (cm) to Movie Scale (cm) is 1 : 3. If there are 7 Mini Model (cm), how many Movie Scale (cm) are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Mini Model (cm)",
    "labelB": "Movie Scale (cm)",
    "targetQuantityName": "Movie Scale (cm)",
    "givenQuantityName": "Mini Model (cm)",
    "givenQuantityValue": 7,
    "correctAnswer": 21,
    "correctUnit": "cm",
    "options": [
      11,
      16,
      21,
      26
    ],
    "unitRateExplanation": "7 Mini Model (cm) represents a scale multiplier of 7 (7 ÷ 1 = 7). Multiplying 3 × 7 = 21 cm (Ratio 1 : 3 = 7 : 21).",
    "studioActionText": "Prop Master places the glowing Spaceship Prop onto the set!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 7,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 11,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 26,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q102_miniature_spaceship_prop",
    "stage": 2,
    "title": "Stage 2: Miniature Spaceship Prop",
    "scenario": "Miniature Spaceship Prop on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Mini Model (cm) to Movie Scale (cm) is 1 : 4. If there are 40 Movie Scale (cm), how many Mini Model (cm) are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "Mini Model (cm)",
    "labelB": "Movie Scale (cm)",
    "targetQuantityName": "Mini Model (cm)",
    "givenQuantityName": "Movie Scale (cm)",
    "givenQuantityValue": 40,
    "correctAnswer": 10,
    "correctUnit": "cm",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "40 Movie Scale (cm) represents a scale multiplier of 10 (40 ÷ 4 = 10). Multiplying 1 × 10 = 10 cm (Ratio 1 : 4 = 10 : 40).",
    "studioActionText": "Prop Master places the glowing Spaceship Prop onto the set!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 10,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q103_miniature_spaceship_prop",
    "stage": 3,
    "title": "Stage 3: Miniature Spaceship Prop",
    "scenario": "Miniature Spaceship Prop on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Mini Model (cm) to Movie Scale (cm) is 1 : 5. If there are 20 Mini Model (cm), how many Movie Scale (cm) are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Mini Model (cm)",
    "labelB": "Movie Scale (cm)",
    "targetQuantityName": "Movie Scale (cm)",
    "givenQuantityName": "Mini Model (cm)",
    "givenQuantityValue": 20,
    "correctAnswer": 100,
    "correctUnit": "cm",
    "options": [
      50,
      75,
      100,
      125
    ],
    "unitRateExplanation": "20 Mini Model (cm) represents a scale multiplier of 20 (20 ÷ 1 = 20). Multiplying 5 × 20 = 100 cm (Ratio 1 : 5 = 20 : 100).",
    "studioActionText": "Prop Master places the glowing Spaceship Prop onto the set!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 20,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 50,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 125,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q104_miniature_spaceship_prop",
    "stage": 4,
    "title": "Stage 4: Miniature Spaceship Prop",
    "scenario": "Miniature Spaceship Prop on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Mini Model (cm) to Movie Scale (cm) is 2 : 3. If there are 12 Movie Scale (cm), how many Mini Model (cm) are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "Mini Model (cm)",
    "labelB": "Movie Scale (cm)",
    "targetQuantityName": "Mini Model (cm)",
    "givenQuantityName": "Movie Scale (cm)",
    "givenQuantityValue": 12,
    "correctAnswer": 8,
    "correctUnit": "cm",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "12 Movie Scale (cm) represents a scale multiplier of 4 (12 ÷ 3 = 4). Multiplying 2 × 4 = 8 cm (Ratio 2 : 3 = 8 : 12).",
    "studioActionText": "Prop Master places the glowing Spaceship Prop onto the set!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 4,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q105_castle_fortress_model",
    "stage": 5,
    "title": "Stage 5: Castle Fortress Model",
    "scenario": "Castle Fortress Model on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Scale Tower (cm) to Real Stone Height (m) is 2 : 3. If there are 24 Scale Tower (cm), how many Real Stone Height (m) are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "Scale Tower (cm)",
    "labelB": "Real Stone Height (m)",
    "targetQuantityName": "Real Stone Height (m)",
    "givenQuantityName": "Scale Tower (cm)",
    "givenQuantityValue": 24,
    "correctAnswer": 36,
    "correctUnit": "meters",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "24 Scale Tower (cm) represents a scale multiplier of 12 (24 ÷ 2 = 12). Multiplying 3 × 12 = 36 meters (Ratio 2 : 3 = 24 : 36).",
    "studioActionText": "Model Makers construct intricate stone battlements!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 12,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q106_castle_fortress_model",
    "stage": 1,
    "title": "Stage 1: Castle Fortress Model",
    "scenario": "Castle Fortress Model on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Scale Tower (cm) to Real Stone Height (m) is 2 : 5. If there are 10 Real Stone Height (m), how many Scale Tower (cm) are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "Scale Tower (cm)",
    "labelB": "Real Stone Height (m)",
    "targetQuantityName": "Scale Tower (cm)",
    "givenQuantityName": "Real Stone Height (m)",
    "givenQuantityValue": 10,
    "correctAnswer": 4,
    "correctUnit": "meters",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "10 Real Stone Height (m) represents a scale multiplier of 2 (10 ÷ 5 = 2). Multiplying 2 × 2 = 4 meters (Ratio 2 : 5 = 4 : 10).",
    "studioActionText": "Model Makers construct intricate stone battlements!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 2,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q107_castle_fortress_model",
    "stage": 2,
    "title": "Stage 2: Castle Fortress Model",
    "scenario": "Castle Fortress Model on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Scale Tower (cm) to Real Stone Height (m) is 3 : 4. If there are 15 Scale Tower (cm), how many Real Stone Height (m) are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Scale Tower (cm)",
    "labelB": "Real Stone Height (m)",
    "targetQuantityName": "Real Stone Height (m)",
    "givenQuantityName": "Scale Tower (cm)",
    "givenQuantityValue": 15,
    "correctAnswer": 20,
    "correctUnit": "meters",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "15 Scale Tower (cm) represents a scale multiplier of 5 (15 ÷ 3 = 5). Multiplying 4 × 5 = 20 meters (Ratio 3 : 4 = 15 : 20).",
    "studioActionText": "Model Makers construct intricate stone battlements!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 5,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q108_castle_fortress_model",
    "stage": 3,
    "title": "Stage 3: Castle Fortress Model",
    "scenario": "Castle Fortress Model on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Scale Tower (cm) to Real Stone Height (m) is 3 : 5. If there are 40 Real Stone Height (m), how many Scale Tower (cm) are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Scale Tower (cm)",
    "labelB": "Real Stone Height (m)",
    "targetQuantityName": "Scale Tower (cm)",
    "givenQuantityName": "Real Stone Height (m)",
    "givenQuantityValue": 40,
    "correctAnswer": 24,
    "correctUnit": "meters",
    "options": [
      12,
      18,
      24,
      30
    ],
    "unitRateExplanation": "40 Real Stone Height (m) represents a scale multiplier of 8 (40 ÷ 5 = 8). Multiplying 3 × 8 = 24 meters (Ratio 3 : 5 = 24 : 40).",
    "studioActionText": "Model Makers construct intricate stone battlements!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 8,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 12,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 30,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q109_sci_fi_blaster_energy_cores",
    "stage": 4,
    "title": "Stage 4: Sci-Fi Blaster Energy Cores",
    "scenario": "Sci-Fi Blaster Energy Cores on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Crystals to LED Modules is 3 : 5. If there are 9 Blue Crystals, how many LED Modules are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Blue Crystals",
    "labelB": "LED Modules",
    "targetQuantityName": "LED Modules",
    "givenQuantityName": "Blue Crystals",
    "givenQuantityValue": 9,
    "correctAnswer": 15,
    "correctUnit": "modules",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "9 Blue Crystals represents a scale multiplier of 3 (9 ÷ 3 = 3). Multiplying 5 × 3 = 15 modules (Ratio 3 : 5 = 9 : 15).",
    "studioActionText": "Electronics Tech wires glowing prop weaponry!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 3,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q110_sci_fi_blaster_energy_cores",
    "stage": 5,
    "title": "Stage 5: Sci-Fi Blaster Energy Cores",
    "scenario": "Sci-Fi Blaster Energy Cores on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Crystals to LED Modules is 4 : 5. If there are 30 LED Modules, how many Blue Crystals are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Blue Crystals",
    "labelB": "LED Modules",
    "targetQuantityName": "Blue Crystals",
    "givenQuantityName": "LED Modules",
    "givenQuantityValue": 30,
    "correctAnswer": 24,
    "correctUnit": "modules",
    "options": [
      12,
      18,
      24,
      30
    ],
    "unitRateExplanation": "30 LED Modules represents a scale multiplier of 6 (30 ÷ 5 = 6). Multiplying 4 × 6 = 24 modules (Ratio 4 : 5 = 24 : 30).",
    "studioActionText": "Electronics Tech wires glowing prop weaponry!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 6,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 12,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 30,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q111_sci_fi_blaster_energy_cores",
    "stage": 1,
    "title": "Stage 1: Sci-Fi Blaster Energy Cores",
    "scenario": "Sci-Fi Blaster Energy Cores on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Crystals to LED Modules is 2 : 7. If there are 18 Blue Crystals, how many LED Modules are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Blue Crystals",
    "labelB": "LED Modules",
    "targetQuantityName": "LED Modules",
    "givenQuantityName": "Blue Crystals",
    "givenQuantityValue": 18,
    "correctAnswer": 63,
    "correctUnit": "modules",
    "options": [
      32,
      47,
      63,
      79
    ],
    "unitRateExplanation": "18 Blue Crystals represents a scale multiplier of 9 (18 ÷ 2 = 9). Multiplying 7 × 9 = 63 modules (Ratio 2 : 7 = 18 : 63).",
    "studioActionText": "Electronics Tech wires glowing prop weaponry!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 9,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 32,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 79,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q112_sci_fi_blaster_energy_cores",
    "stage": 2,
    "title": "Stage 2: Sci-Fi Blaster Energy Cores",
    "scenario": "Sci-Fi Blaster Energy Cores on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Blue Crystals to LED Modules is 3 : 7. If there are 105 LED Modules, how many Blue Crystals are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Blue Crystals",
    "labelB": "LED Modules",
    "targetQuantityName": "Blue Crystals",
    "givenQuantityName": "LED Modules",
    "givenQuantityValue": 105,
    "correctAnswer": 45,
    "correctUnit": "modules",
    "options": [
      23,
      34,
      45,
      56
    ],
    "unitRateExplanation": "105 LED Modules represents a scale multiplier of 15 (105 ÷ 7 = 15). Multiplying 3 × 15 = 45 modules (Ratio 3 : 7 = 45 : 105).",
    "studioActionText": "Electronics Tech wires glowing prop weaponry!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 15,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 23,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 56,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q113_treasure_chest_gold_coins",
    "stage": 3,
    "title": "Stage 3: Treasure Chest Gold Coins",
    "scenario": "Treasure Chest Gold Coins on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Doubloons to Silver Crowns is 3 : 7. If there are 21 Gold Doubloons, how many Silver Crowns are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Gold Doubloons",
    "labelB": "Silver Crowns",
    "targetQuantityName": "Silver Crowns",
    "givenQuantityName": "Gold Doubloons",
    "givenQuantityValue": 21,
    "correctAnswer": 49,
    "correctUnit": "coins",
    "options": [
      25,
      37,
      49,
      61
    ],
    "unitRateExplanation": "21 Gold Doubloons represents a scale multiplier of 7 (21 ÷ 3 = 7). Multiplying 7 × 7 = 49 coins (Ratio 3 : 7 = 21 : 49).",
    "studioActionText": "Prop Master fills the pirate chest to the brim!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 7,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 25,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 61,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q114_treasure_chest_gold_coins",
    "stage": 4,
    "title": "Stage 4: Treasure Chest Gold Coins",
    "scenario": "Treasure Chest Gold Coins on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Doubloons to Silver Crowns is 5 : 6. If there are 60 Silver Crowns, how many Gold Doubloons are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Gold Doubloons",
    "labelB": "Silver Crowns",
    "targetQuantityName": "Gold Doubloons",
    "givenQuantityName": "Silver Crowns",
    "givenQuantityValue": 60,
    "correctAnswer": 50,
    "correctUnit": "coins",
    "options": [
      25,
      38,
      50,
      63
    ],
    "unitRateExplanation": "60 Silver Crowns represents a scale multiplier of 10 (60 ÷ 6 = 10). Multiplying 5 × 10 = 50 coins (Ratio 5 : 6 = 50 : 60).",
    "studioActionText": "Prop Master fills the pirate chest to the brim!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 10,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 25,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 63,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q115_treasure_chest_gold_coins",
    "stage": 5,
    "title": "Stage 5: Treasure Chest Gold Coins",
    "scenario": "Treasure Chest Gold Coins on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Doubloons to Silver Crowns is 1 : 10. If there are 20 Gold Doubloons, how many Silver Crowns are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Gold Doubloons",
    "labelB": "Silver Crowns",
    "targetQuantityName": "Silver Crowns",
    "givenQuantityName": "Gold Doubloons",
    "givenQuantityValue": 20,
    "correctAnswer": 200,
    "correctUnit": "coins",
    "options": [
      100,
      150,
      200,
      250
    ],
    "unitRateExplanation": "20 Gold Doubloons represents a scale multiplier of 20 (20 ÷ 1 = 20). Multiplying 10 × 20 = 200 coins (Ratio 1 : 10 = 20 : 200).",
    "studioActionText": "Prop Master fills the pirate chest to the brim!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 20,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 100,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 250,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q116_treasure_chest_gold_coins",
    "stage": 1,
    "title": "Stage 1: Treasure Chest Gold Coins",
    "scenario": "Treasure Chest Gold Coins on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Gold Doubloons to Silver Crowns is 2 : 1. If there are 4 Silver Crowns, how many Gold Doubloons are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "Gold Doubloons",
    "labelB": "Silver Crowns",
    "targetQuantityName": "Gold Doubloons",
    "givenQuantityName": "Silver Crowns",
    "givenQuantityValue": 4,
    "correctAnswer": 8,
    "correctUnit": "coins",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "4 Silver Crowns represents a scale multiplier of 4 (4 ÷ 1 = 4). Multiplying 2 × 4 = 8 coins (Ratio 2 : 1 = 8 : 4).",
    "studioActionText": "Prop Master fills the pirate chest to the brim!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 4,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q117_alien_artifact_relic",
    "stage": 2,
    "title": "Stage 2: Alien Artifact Relic",
    "scenario": "Alien Artifact Relic on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Carved Glyphs to Inlaid Jewels is 2 : 1. If there are 24 Carved Glyphs, how many Inlaid Jewels are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "Carved Glyphs",
    "labelB": "Inlaid Jewels",
    "targetQuantityName": "Inlaid Jewels",
    "givenQuantityName": "Carved Glyphs",
    "givenQuantityValue": 24,
    "correctAnswer": 12,
    "correctUnit": "jewels",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "24 Carved Glyphs represents a scale multiplier of 12 (24 ÷ 2 = 12). Multiplying 1 × 12 = 12 jewels (Ratio 2 : 1 = 24 : 12).",
    "studioActionText": "Artisan polishes ancient hieroglyphs on the monolith!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 12,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q118_alien_artifact_relic",
    "stage": 3,
    "title": "Stage 3: Alien Artifact Relic",
    "scenario": "Alien Artifact Relic on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Carved Glyphs to Inlaid Jewels is 3 : 1. If there are 2 Inlaid Jewels, how many Carved Glyphs are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "Carved Glyphs",
    "labelB": "Inlaid Jewels",
    "targetQuantityName": "Carved Glyphs",
    "givenQuantityName": "Inlaid Jewels",
    "givenQuantityValue": 2,
    "correctAnswer": 6,
    "correctUnit": "jewels",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "2 Inlaid Jewels represents a scale multiplier of 2 (2 ÷ 1 = 2). Multiplying 3 × 2 = 6 jewels (Ratio 3 : 1 = 6 : 2).",
    "studioActionText": "Artisan polishes ancient hieroglyphs on the monolith!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 2,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q119_alien_artifact_relic",
    "stage": 4,
    "title": "Stage 4: Alien Artifact Relic",
    "scenario": "Alien Artifact Relic on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Carved Glyphs to Inlaid Jewels is 3 : 2. If there are 15 Carved Glyphs, how many Inlaid Jewels are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Carved Glyphs",
    "labelB": "Inlaid Jewels",
    "targetQuantityName": "Inlaid Jewels",
    "givenQuantityName": "Carved Glyphs",
    "givenQuantityValue": 15,
    "correctAnswer": 10,
    "correctUnit": "jewels",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "15 Carved Glyphs represents a scale multiplier of 5 (15 ÷ 3 = 5). Multiplying 2 × 5 = 10 jewels (Ratio 3 : 2 = 15 : 10).",
    "studioActionText": "Artisan polishes ancient hieroglyphs on the monolith!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 5,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q120_alien_artifact_relic",
    "stage": 5,
    "title": "Stage 5: Alien Artifact Relic",
    "scenario": "Alien Artifact Relic on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Carved Glyphs to Inlaid Jewels is 4 : 1. If there are 8 Inlaid Jewels, how many Carved Glyphs are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Carved Glyphs",
    "labelB": "Inlaid Jewels",
    "targetQuantityName": "Carved Glyphs",
    "givenQuantityName": "Inlaid Jewels",
    "givenQuantityValue": 8,
    "correctAnswer": 32,
    "correctUnit": "jewels",
    "options": [
      16,
      24,
      32,
      40
    ],
    "unitRateExplanation": "8 Inlaid Jewels represents a scale multiplier of 8 (8 ÷ 1 = 8). Multiplying 4 × 8 = 32 jewels (Ratio 4 : 1 = 32 : 8).",
    "studioActionText": "Artisan polishes ancient hieroglyphs on the monolith!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 8,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 16,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 40,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q121_boom_mic_audio_tracks",
    "stage": 1,
    "title": "Stage 1: Boom Mic Audio Tracks",
    "scenario": "Boom Mic Audio Tracks on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Dialogue Tracks to Foley FX Tracks is 3 : 4. If there are 24 Dialogue Tracks, how many Foley FX Tracks are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Dialogue Tracks",
    "labelB": "Foley FX Tracks",
    "targetQuantityName": "Foley FX Tracks",
    "givenQuantityName": "Dialogue Tracks",
    "givenQuantityValue": 24,
    "correctAnswer": 32,
    "correctUnit": "tracks",
    "options": [
      16,
      24,
      32,
      40
    ],
    "unitRateExplanation": "24 Dialogue Tracks represents a scale multiplier of 8 (24 ÷ 3 = 8). Multiplying 4 × 8 = 32 tracks (Ratio 3 : 4 = 24 : 32).",
    "studioActionText": "Sound Mixer balances dialogue clarity and footsteps!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 8,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 16,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 40,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q122_boom_mic_audio_tracks",
    "stage": 2,
    "title": "Stage 2: Boom Mic Audio Tracks",
    "scenario": "Boom Mic Audio Tracks on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Dialogue Tracks to Foley FX Tracks is 3 : 5. If there are 60 Foley FX Tracks, how many Dialogue Tracks are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Dialogue Tracks",
    "labelB": "Foley FX Tracks",
    "targetQuantityName": "Dialogue Tracks",
    "givenQuantityName": "Foley FX Tracks",
    "givenQuantityValue": 60,
    "correctAnswer": 36,
    "correctUnit": "tracks",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "60 Foley FX Tracks represents a scale multiplier of 12 (60 ÷ 5 = 12). Multiplying 3 × 12 = 36 tracks (Ratio 3 : 5 = 36 : 60).",
    "studioActionText": "Sound Mixer balances dialogue clarity and footsteps!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 12,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q123_boom_mic_audio_tracks",
    "stage": 3,
    "title": "Stage 3: Boom Mic Audio Tracks",
    "scenario": "Boom Mic Audio Tracks on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Dialogue Tracks to Foley FX Tracks is 4 : 5. If there are 8 Dialogue Tracks, how many Foley FX Tracks are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Dialogue Tracks",
    "labelB": "Foley FX Tracks",
    "targetQuantityName": "Foley FX Tracks",
    "givenQuantityName": "Dialogue Tracks",
    "givenQuantityValue": 8,
    "correctAnswer": 10,
    "correctUnit": "tracks",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "8 Dialogue Tracks represents a scale multiplier of 2 (8 ÷ 4 = 2). Multiplying 5 × 2 = 10 tracks (Ratio 4 : 5 = 8 : 10).",
    "studioActionText": "Sound Mixer balances dialogue clarity and footsteps!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 2,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q124_boom_mic_audio_tracks",
    "stage": 4,
    "title": "Stage 4: Boom Mic Audio Tracks",
    "scenario": "Boom Mic Audio Tracks on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Dialogue Tracks to Foley FX Tracks is 2 : 7. If there are 35 Foley FX Tracks, how many Dialogue Tracks are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Dialogue Tracks",
    "labelB": "Foley FX Tracks",
    "targetQuantityName": "Dialogue Tracks",
    "givenQuantityName": "Foley FX Tracks",
    "givenQuantityValue": 35,
    "correctAnswer": 10,
    "correctUnit": "tracks",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "35 Foley FX Tracks represents a scale multiplier of 5 (35 ÷ 7 = 5). Multiplying 2 × 5 = 10 tracks (Ratio 2 : 7 = 10 : 35).",
    "studioActionText": "Sound Mixer balances dialogue clarity and footsteps!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 5,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q125_orchestral_string_section",
    "stage": 5,
    "title": "Stage 5: Orchestral String Section",
    "scenario": "Orchestral String Section on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Violins to Cellos is 2 : 7. If there are 30 Violins, how many Cellos are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Violins",
    "labelB": "Cellos",
    "targetQuantityName": "Cellos",
    "givenQuantityName": "Violins",
    "givenQuantityValue": 30,
    "correctAnswer": 105,
    "correctUnit": "instruments",
    "options": [
      53,
      79,
      105,
      131
    ],
    "unitRateExplanation": "30 Violins represents a scale multiplier of 15 (30 ÷ 2 = 15). Multiplying 7 × 15 = 105 instruments (Ratio 2 : 7 = 30 : 105).",
    "studioActionText": "Composer conducts the soaring cinematic crescendo!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 15,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 53,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 131,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q126_orchestral_string_section",
    "stage": 1,
    "title": "Stage 1: Orchestral String Section",
    "scenario": "Orchestral String Section on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Violins to Cellos is 3 : 7. If there are 21 Cellos, how many Violins are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Violins",
    "labelB": "Cellos",
    "targetQuantityName": "Violins",
    "givenQuantityName": "Cellos",
    "givenQuantityValue": 21,
    "correctAnswer": 9,
    "correctUnit": "instruments",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "21 Cellos represents a scale multiplier of 3 (21 ÷ 7 = 3). Multiplying 3 × 3 = 9 instruments (Ratio 3 : 7 = 9 : 21).",
    "studioActionText": "Composer conducts the soaring cinematic crescendo!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 3,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q127_orchestral_string_section",
    "stage": 2,
    "title": "Stage 2: Orchestral String Section",
    "scenario": "Orchestral String Section on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Violins to Cellos is 5 : 6. If there are 30 Violins, how many Cellos are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Violins",
    "labelB": "Cellos",
    "targetQuantityName": "Cellos",
    "givenQuantityName": "Violins",
    "givenQuantityValue": 30,
    "correctAnswer": 36,
    "correctUnit": "instruments",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "30 Violins represents a scale multiplier of 6 (30 ÷ 5 = 6). Multiplying 6 × 6 = 36 instruments (Ratio 5 : 6 = 30 : 36).",
    "studioActionText": "Composer conducts the soaring cinematic crescendo!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 6,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q128_orchestral_string_section",
    "stage": 3,
    "title": "Stage 3: Orchestral String Section",
    "scenario": "Orchestral String Section on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Violins to Cellos is 1 : 10. If there are 90 Cellos, how many Violins are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Violins",
    "labelB": "Cellos",
    "targetQuantityName": "Violins",
    "givenQuantityName": "Cellos",
    "givenQuantityValue": 90,
    "correctAnswer": 9,
    "correctUnit": "instruments",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "90 Cellos represents a scale multiplier of 9 (90 ÷ 10 = 9). Multiplying 1 × 9 = 9 instruments (Ratio 1 : 10 = 9 : 90).",
    "studioActionText": "Composer conducts the soaring cinematic crescendo!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 9,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q129_soundtrack_beats_tempo",
    "stage": 4,
    "title": "Stage 4: Soundtrack Beats & Tempo",
    "scenario": "Soundtrack Beats & Tempo on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Melody Beats to Drum Hits is 1 : 10. If there are 4 Melody Beats, how many Drum Hits are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Melody Beats",
    "labelB": "Drum Hits",
    "targetQuantityName": "Drum Hits",
    "givenQuantityName": "Melody Beats",
    "givenQuantityValue": 4,
    "correctAnswer": 40,
    "correctUnit": "beats",
    "options": [
      20,
      30,
      40,
      50
    ],
    "unitRateExplanation": "4 Melody Beats represents a scale multiplier of 4 (4 ÷ 1 = 4). Multiplying 10 × 4 = 40 beats (Ratio 1 : 10 = 4 : 40).",
    "studioActionText": "Music Editor syncs action beats to the orchestral score!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 4,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 20,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 50,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q130_soundtrack_beats_tempo",
    "stage": 5,
    "title": "Stage 5: Soundtrack Beats & Tempo",
    "scenario": "Soundtrack Beats & Tempo on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Melody Beats to Drum Hits is 2 : 1. If there are 7 Drum Hits, how many Melody Beats are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "Melody Beats",
    "labelB": "Drum Hits",
    "targetQuantityName": "Melody Beats",
    "givenQuantityName": "Drum Hits",
    "givenQuantityValue": 7,
    "correctAnswer": 14,
    "correctUnit": "beats",
    "options": [
      7,
      11,
      14,
      18
    ],
    "unitRateExplanation": "7 Drum Hits represents a scale multiplier of 7 (7 ÷ 1 = 7). Multiplying 2 × 7 = 14 beats (Ratio 2 : 1 = 14 : 7).",
    "studioActionText": "Music Editor syncs action beats to the orchestral score!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 7,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 7,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 18,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q131_soundtrack_beats_tempo",
    "stage": 1,
    "title": "Stage 1: Soundtrack Beats & Tempo",
    "scenario": "Soundtrack Beats & Tempo on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Melody Beats to Drum Hits is 3 : 1. If there are 30 Melody Beats, how many Drum Hits are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "Melody Beats",
    "labelB": "Drum Hits",
    "targetQuantityName": "Drum Hits",
    "givenQuantityName": "Melody Beats",
    "givenQuantityValue": 30,
    "correctAnswer": 10,
    "correctUnit": "beats",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "30 Melody Beats represents a scale multiplier of 10 (30 ÷ 3 = 10). Multiplying 1 × 10 = 10 beats (Ratio 3 : 1 = 30 : 10).",
    "studioActionText": "Music Editor syncs action beats to the orchestral score!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 10,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q132_soundtrack_beats_tempo",
    "stage": 2,
    "title": "Stage 2: Soundtrack Beats & Tempo",
    "scenario": "Soundtrack Beats & Tempo on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Melody Beats to Drum Hits is 3 : 2. If there are 40 Drum Hits, how many Melody Beats are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Melody Beats",
    "labelB": "Drum Hits",
    "targetQuantityName": "Melody Beats",
    "givenQuantityName": "Drum Hits",
    "givenQuantityValue": 40,
    "correctAnswer": 60,
    "correctUnit": "beats",
    "options": [
      30,
      45,
      60,
      75
    ],
    "unitRateExplanation": "40 Drum Hits represents a scale multiplier of 20 (40 ÷ 2 = 20). Multiplying 3 × 20 = 60 beats (Ratio 3 : 2 = 60 : 40).",
    "studioActionText": "Music Editor syncs action beats to the orchestral score!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 20,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 30,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 75,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q133_studio_soundproofing",
    "stage": 3,
    "title": "Stage 3: Studio Soundproofing",
    "scenario": "Studio Soundproofing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Acoustic Foam Panels to Bass Traps is 3 : 2. If there are 24 Acoustic Foam Panels, how many Bass Traps are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Acoustic Foam Panels",
    "labelB": "Bass Traps",
    "targetQuantityName": "Bass Traps",
    "givenQuantityName": "Acoustic Foam Panels",
    "givenQuantityValue": 24,
    "correctAnswer": 16,
    "correctUnit": "panels",
    "options": [
      8,
      12,
      16,
      20
    ],
    "unitRateExplanation": "24 Acoustic Foam Panels represents a scale multiplier of 8 (24 ÷ 3 = 8). Multiplying 2 × 8 = 16 panels (Ratio 3 : 2 = 24 : 16).",
    "studioActionText": "Audio Engineer lines sound booth walls for pristine silence!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 8,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 20,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q134_studio_soundproofing",
    "stage": 4,
    "title": "Stage 4: Studio Soundproofing",
    "scenario": "Studio Soundproofing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Acoustic Foam Panels to Bass Traps is 4 : 1. If there are 12 Bass Traps, how many Acoustic Foam Panels are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Acoustic Foam Panels",
    "labelB": "Bass Traps",
    "targetQuantityName": "Acoustic Foam Panels",
    "givenQuantityName": "Bass Traps",
    "givenQuantityValue": 12,
    "correctAnswer": 48,
    "correctUnit": "panels",
    "options": [
      24,
      36,
      48,
      60
    ],
    "unitRateExplanation": "12 Bass Traps represents a scale multiplier of 12 (12 ÷ 1 = 12). Multiplying 4 × 12 = 48 panels (Ratio 4 : 1 = 48 : 12).",
    "studioActionText": "Audio Engineer lines sound booth walls for pristine silence!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 12,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 24,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 60,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q135_studio_soundproofing",
    "stage": 5,
    "title": "Stage 5: Studio Soundproofing",
    "scenario": "Studio Soundproofing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Acoustic Foam Panels to Bass Traps is 5 : 2. If there are 10 Acoustic Foam Panels, how many Bass Traps are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Acoustic Foam Panels",
    "labelB": "Bass Traps",
    "targetQuantityName": "Bass Traps",
    "givenQuantityName": "Acoustic Foam Panels",
    "givenQuantityValue": 10,
    "correctAnswer": 4,
    "correctUnit": "panels",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "10 Acoustic Foam Panels represents a scale multiplier of 2 (10 ÷ 5 = 2). Multiplying 2 × 2 = 4 panels (Ratio 5 : 2 = 10 : 4).",
    "studioActionText": "Audio Engineer lines sound booth walls for pristine silence!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 2,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q136_studio_soundproofing",
    "stage": 1,
    "title": "Stage 1: Studio Soundproofing",
    "scenario": "Studio Soundproofing on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Acoustic Foam Panels to Bass Traps is 4 : 3. If there are 15 Bass Traps, how many Acoustic Foam Panels are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Acoustic Foam Panels",
    "labelB": "Bass Traps",
    "targetQuantityName": "Acoustic Foam Panels",
    "givenQuantityName": "Bass Traps",
    "givenQuantityValue": 15,
    "correctAnswer": 20,
    "correctUnit": "panels",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "15 Bass Traps represents a scale multiplier of 5 (15 ÷ 3 = 5). Multiplying 4 × 5 = 20 panels (Ratio 4 : 3 = 20 : 15).",
    "studioActionText": "Audio Engineer lines sound booth walls for pristine silence!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 5,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q137_voiceover_dubbing_session",
    "stage": 2,
    "title": "Stage 2: Voiceover Dubbing Session",
    "scenario": "Voiceover Dubbing Session on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Rehearsal Takes to Master Takes is 4 : 3. If there are 60 Rehearsal Takes, how many Master Takes are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Rehearsal Takes",
    "labelB": "Master Takes",
    "targetQuantityName": "Master Takes",
    "givenQuantityName": "Rehearsal Takes",
    "givenQuantityValue": 60,
    "correctAnswer": 45,
    "correctUnit": "takes",
    "options": [
      23,
      34,
      45,
      56
    ],
    "unitRateExplanation": "60 Rehearsal Takes represents a scale multiplier of 15 (60 ÷ 4 = 15). Multiplying 3 × 15 = 45 takes (Ratio 4 : 3 = 60 : 45).",
    "studioActionText": "Voice Actor delivers punchy animated character lines!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 15,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 23,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 56,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q138_voiceover_dubbing_session",
    "stage": 3,
    "title": "Stage 3: Voiceover Dubbing Session",
    "scenario": "Voiceover Dubbing Session on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Rehearsal Takes to Master Takes is 5 : 3. If there are 9 Master Takes, how many Rehearsal Takes are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Rehearsal Takes",
    "labelB": "Master Takes",
    "targetQuantityName": "Rehearsal Takes",
    "givenQuantityName": "Master Takes",
    "givenQuantityValue": 9,
    "correctAnswer": 15,
    "correctUnit": "takes",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "9 Master Takes represents a scale multiplier of 3 (9 ÷ 3 = 3). Multiplying 5 × 3 = 15 takes (Ratio 5 : 3 = 15 : 9).",
    "studioActionText": "Voice Actor delivers punchy animated character lines!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 3,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q139_voiceover_dubbing_session",
    "stage": 4,
    "title": "Stage 4: Voiceover Dubbing Session",
    "scenario": "Voiceover Dubbing Session on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Rehearsal Takes to Master Takes is 7 : 2. If there are 42 Rehearsal Takes, how many Master Takes are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Rehearsal Takes",
    "labelB": "Master Takes",
    "targetQuantityName": "Master Takes",
    "givenQuantityName": "Rehearsal Takes",
    "givenQuantityValue": 42,
    "correctAnswer": 12,
    "correctUnit": "takes",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "42 Rehearsal Takes represents a scale multiplier of 6 (42 ÷ 7 = 6). Multiplying 2 × 6 = 12 takes (Ratio 7 : 2 = 42 : 12).",
    "studioActionText": "Voice Actor delivers punchy animated character lines!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 6,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q140_voiceover_dubbing_session",
    "stage": 5,
    "title": "Stage 5: Voiceover Dubbing Session",
    "scenario": "Voiceover Dubbing Session on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Rehearsal Takes to Master Takes is 1 : 6. If there are 54 Master Takes, how many Rehearsal Takes are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "Rehearsal Takes",
    "labelB": "Master Takes",
    "targetQuantityName": "Rehearsal Takes",
    "givenQuantityName": "Master Takes",
    "givenQuantityValue": 54,
    "correctAnswer": 9,
    "correctUnit": "takes",
    "options": [
      5,
      7,
      9,
      11
    ],
    "unitRateExplanation": "54 Master Takes represents a scale multiplier of 9 (54 ÷ 6 = 9). Multiplying 1 × 9 = 9 takes (Ratio 1 : 6 = 9 : 54).",
    "studioActionText": "Voice Actor delivers punchy animated character lines!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 9,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 11,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q141_finale_budget_division",
    "stage": 1,
    "title": "Stage 1: Finale Budget Division",
    "scenario": "Finale Budget Division on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Actor Share ($) to Crew Share ($) is 5 : 6. If there are 45 Actor Share ($), how many Crew Share ($) are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Actor Share ($)",
    "labelB": "Crew Share ($)",
    "targetQuantityName": "Crew Share ($)",
    "givenQuantityName": "Actor Share ($)",
    "givenQuantityValue": 45,
    "correctAnswer": 54,
    "correctUnit": "$",
    "options": [
      27,
      41,
      54,
      68
    ],
    "unitRateExplanation": "45 Actor Share ($) represents a scale multiplier of 9 (45 ÷ 5 = 9). Multiplying 6 × 9 = 54 $ (Ratio 5 : 6 = 45 : 54).",
    "studioActionText": "Director shouts: \"PICTURE READY! Camera speed, sound rolling... ACTION!\"",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 9,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 27,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 68,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q142_finale_budget_division",
    "stage": 2,
    "title": "Stage 2: Finale Budget Division",
    "scenario": "Finale Budget Division on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Actor Share ($) to Crew Share ($) is 1 : 10. If there are 150 Crew Share ($), how many Actor Share ($) are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Actor Share ($)",
    "labelB": "Crew Share ($)",
    "targetQuantityName": "Actor Share ($)",
    "givenQuantityName": "Crew Share ($)",
    "givenQuantityValue": 150,
    "correctAnswer": 15,
    "correctUnit": "$",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "150 Crew Share ($) represents a scale multiplier of 15 (150 ÷ 10 = 15). Multiplying 1 × 15 = 15 $ (Ratio 1 : 10 = 15 : 150).",
    "studioActionText": "Director shouts: \"PICTURE READY! Camera speed, sound rolling... ACTION!\"",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 15,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q143_finale_budget_division",
    "stage": 3,
    "title": "Stage 3: Finale Budget Division",
    "scenario": "Finale Budget Division on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Actor Share ($) to Crew Share ($) is 2 : 1. If there are 6 Actor Share ($), how many Crew Share ($) are needed?",
    "ratioA": 2,
    "ratioB": 1,
    "labelA": "Actor Share ($)",
    "labelB": "Crew Share ($)",
    "targetQuantityName": "Crew Share ($)",
    "givenQuantityName": "Actor Share ($)",
    "givenQuantityValue": 6,
    "correctAnswer": 3,
    "correctUnit": "$",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "6 Actor Share ($) represents a scale multiplier of 3 (6 ÷ 2 = 3). Multiplying 1 × 3 = 3 $ (Ratio 2 : 1 = 6 : 3).",
    "studioActionText": "Director shouts: \"PICTURE READY! Camera speed, sound rolling... ACTION!\"",
    "diagram": {
      "blocksA": 2,
      "blocksB": 1,
      "multiplier": 3,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q144_finale_budget_division",
    "stage": 4,
    "title": "Stage 4: Finale Budget Division",
    "scenario": "Finale Budget Division on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Actor Share ($) to Crew Share ($) is 3 : 1. If there are 6 Crew Share ($), how many Actor Share ($) are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "Actor Share ($)",
    "labelB": "Crew Share ($)",
    "targetQuantityName": "Actor Share ($)",
    "givenQuantityName": "Crew Share ($)",
    "givenQuantityValue": 6,
    "correctAnswer": 18,
    "correctUnit": "$",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "6 Crew Share ($) represents a scale multiplier of 6 (6 ÷ 1 = 6). Multiplying 3 × 6 = 18 $ (Ratio 3 : 1 = 18 : 6).",
    "studioActionText": "Director shouts: \"PICTURE READY! Camera speed, sound rolling... ACTION!\"",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 6,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q145_craft_services_catering",
    "stage": 5,
    "title": "Stage 5: Craft Services Catering",
    "scenario": "Craft Services Catering on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Fruit Baskets to Sandwich Platters is 3 : 1. If there are 60 Fruit Baskets, how many Sandwich Platters are needed?",
    "ratioA": 3,
    "ratioB": 1,
    "labelA": "Fruit Baskets",
    "labelB": "Sandwich Platters",
    "targetQuantityName": "Sandwich Platters",
    "givenQuantityName": "Fruit Baskets",
    "givenQuantityValue": 60,
    "correctAnswer": 20,
    "correctUnit": "platters",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "60 Fruit Baskets represents a scale multiplier of 20 (60 ÷ 3 = 20). Multiplying 1 × 20 = 20 platters (Ratio 3 : 1 = 60 : 20).",
    "studioActionText": "Catering Team fuels cast and crew with delicious healthy snacks!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 1,
      "multiplier": 20,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q146_craft_services_catering",
    "stage": 1,
    "title": "Stage 1: Craft Services Catering",
    "scenario": "Craft Services Catering on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Fruit Baskets to Sandwich Platters is 3 : 2. If there are 8 Sandwich Platters, how many Fruit Baskets are needed?",
    "ratioA": 3,
    "ratioB": 2,
    "labelA": "Fruit Baskets",
    "labelB": "Sandwich Platters",
    "targetQuantityName": "Fruit Baskets",
    "givenQuantityName": "Sandwich Platters",
    "givenQuantityValue": 8,
    "correctAnswer": 12,
    "correctUnit": "platters",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "8 Sandwich Platters represents a scale multiplier of 4 (8 ÷ 2 = 4). Multiplying 3 × 4 = 12 platters (Ratio 3 : 2 = 12 : 8).",
    "studioActionText": "Catering Team fuels cast and crew with delicious healthy snacks!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 2,
      "multiplier": 4,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q147_craft_services_catering",
    "stage": 2,
    "title": "Stage 2: Craft Services Catering",
    "scenario": "Craft Services Catering on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Fruit Baskets to Sandwich Platters is 4 : 1. If there are 28 Fruit Baskets, how many Sandwich Platters are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Fruit Baskets",
    "labelB": "Sandwich Platters",
    "targetQuantityName": "Sandwich Platters",
    "givenQuantityName": "Fruit Baskets",
    "givenQuantityValue": 28,
    "correctAnswer": 7,
    "correctUnit": "platters",
    "options": [
      4,
      5,
      7,
      9
    ],
    "unitRateExplanation": "28 Fruit Baskets represents a scale multiplier of 7 (28 ÷ 4 = 7). Multiplying 1 × 7 = 7 platters (Ratio 4 : 1 = 28 : 7).",
    "studioActionText": "Catering Team fuels cast and crew with delicious healthy snacks!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 7,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 9,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q148_craft_services_catering",
    "stage": 3,
    "title": "Stage 3: Craft Services Catering",
    "scenario": "Craft Services Catering on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Fruit Baskets to Sandwich Platters is 5 : 2. If there are 20 Sandwich Platters, how many Fruit Baskets are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Fruit Baskets",
    "labelB": "Sandwich Platters",
    "targetQuantityName": "Fruit Baskets",
    "givenQuantityName": "Sandwich Platters",
    "givenQuantityValue": 20,
    "correctAnswer": 50,
    "correctUnit": "platters",
    "options": [
      25,
      38,
      50,
      63
    ],
    "unitRateExplanation": "20 Sandwich Platters represents a scale multiplier of 10 (20 ÷ 2 = 10). Multiplying 5 × 10 = 50 platters (Ratio 5 : 2 = 50 : 20).",
    "studioActionText": "Catering Team fuels cast and crew with delicious healthy snacks!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 10,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 25,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 63,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q149_production_days_schedule",
    "stage": 4,
    "title": "Stage 4: Production Days Schedule",
    "scenario": "Production Days Schedule on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Studio Stage Days to Location Shoot Days is 5 : 2. If there are 25 Studio Stage Days, how many Location Shoot Days are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Studio Stage Days",
    "labelB": "Location Shoot Days",
    "targetQuantityName": "Location Shoot Days",
    "givenQuantityName": "Studio Stage Days",
    "givenQuantityValue": 25,
    "correctAnswer": 10,
    "correctUnit": "days",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "25 Studio Stage Days represents a scale multiplier of 5 (25 ÷ 5 = 5). Multiplying 2 × 5 = 10 days (Ratio 5 : 2 = 25 : 10).",
    "studioActionText": "Line Producer locks in the 30-day filming timetable!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 5,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q150_production_days_schedule",
    "stage": 5,
    "title": "Stage 5: Production Days Schedule",
    "scenario": "Production Days Schedule on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Studio Stage Days to Location Shoot Days is 4 : 3. If there are 24 Location Shoot Days, how many Studio Stage Days are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Studio Stage Days",
    "labelB": "Location Shoot Days",
    "targetQuantityName": "Studio Stage Days",
    "givenQuantityName": "Location Shoot Days",
    "givenQuantityValue": 24,
    "correctAnswer": 32,
    "correctUnit": "days",
    "options": [
      16,
      24,
      32,
      40
    ],
    "unitRateExplanation": "24 Location Shoot Days represents a scale multiplier of 8 (24 ÷ 3 = 8). Multiplying 4 × 8 = 32 days (Ratio 4 : 3 = 32 : 24).",
    "studioActionText": "Line Producer locks in the 30-day filming timetable!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 8,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 16,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 40,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q151_production_days_schedule",
    "stage": 1,
    "title": "Stage 1: Production Days Schedule",
    "scenario": "Production Days Schedule on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Studio Stage Days to Location Shoot Days is 5 : 3. If there are 60 Studio Stage Days, how many Location Shoot Days are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Studio Stage Days",
    "labelB": "Location Shoot Days",
    "targetQuantityName": "Location Shoot Days",
    "givenQuantityName": "Studio Stage Days",
    "givenQuantityValue": 60,
    "correctAnswer": 36,
    "correctUnit": "days",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "60 Studio Stage Days represents a scale multiplier of 12 (60 ÷ 5 = 12). Multiplying 3 × 12 = 36 days (Ratio 5 : 3 = 60 : 36).",
    "studioActionText": "Line Producer locks in the 30-day filming timetable!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 12,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q152_production_days_schedule",
    "stage": 2,
    "title": "Stage 2: Production Days Schedule",
    "scenario": "Production Days Schedule on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Studio Stage Days to Location Shoot Days is 7 : 2. If there are 4 Location Shoot Days, how many Studio Stage Days are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Studio Stage Days",
    "labelB": "Location Shoot Days",
    "targetQuantityName": "Studio Stage Days",
    "givenQuantityName": "Location Shoot Days",
    "givenQuantityValue": 4,
    "correctAnswer": 14,
    "correctUnit": "days",
    "options": [
      7,
      11,
      14,
      18
    ],
    "unitRateExplanation": "4 Location Shoot Days represents a scale multiplier of 2 (4 ÷ 2 = 2). Multiplying 7 × 2 = 14 days (Ratio 7 : 2 = 14 : 4).",
    "studioActionText": "Line Producer locks in the 30-day filming timetable!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 2,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 7,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 18,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q153_extras_casting_roster",
    "stage": 3,
    "title": "Stage 3: Extras Casting Roster",
    "scenario": "Extras Casting Roster on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Featured Extras to Background Crowd is 7 : 2. If there are 63 Featured Extras, how many Background Crowd are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Featured Extras",
    "labelB": "Background Crowd",
    "targetQuantityName": "Background Crowd",
    "givenQuantityName": "Featured Extras",
    "givenQuantityValue": 63,
    "correctAnswer": 18,
    "correctUnit": "people",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "63 Featured Extras represents a scale multiplier of 9 (63 ÷ 7 = 9). Multiplying 2 × 9 = 18 people (Ratio 7 : 2 = 63 : 18).",
    "studioActionText": "Casting Director stages 200 extras for the ballroom scene!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 9,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q154_extras_casting_roster",
    "stage": 4,
    "title": "Stage 4: Extras Casting Roster",
    "scenario": "Extras Casting Roster on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Featured Extras to Background Crowd is 1 : 6. If there are 90 Background Crowd, how many Featured Extras are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "Featured Extras",
    "labelB": "Background Crowd",
    "targetQuantityName": "Featured Extras",
    "givenQuantityName": "Background Crowd",
    "givenQuantityValue": 90,
    "correctAnswer": 15,
    "correctUnit": "people",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "90 Background Crowd represents a scale multiplier of 15 (90 ÷ 6 = 15). Multiplying 1 × 15 = 15 people (Ratio 1 : 6 = 15 : 90).",
    "studioActionText": "Casting Director stages 200 extras for the ballroom scene!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 15,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q155_extras_casting_roster",
    "stage": 5,
    "title": "Stage 5: Extras Casting Roster",
    "scenario": "Extras Casting Roster on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Featured Extras to Background Crowd is 2 : 9. If there are 6 Featured Extras, how many Background Crowd are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "Featured Extras",
    "labelB": "Background Crowd",
    "targetQuantityName": "Background Crowd",
    "givenQuantityName": "Featured Extras",
    "givenQuantityValue": 6,
    "correctAnswer": 27,
    "correctUnit": "people",
    "options": [
      14,
      20,
      27,
      34
    ],
    "unitRateExplanation": "6 Featured Extras represents a scale multiplier of 3 (6 ÷ 2 = 3). Multiplying 9 × 3 = 27 people (Ratio 2 : 9 = 6 : 27).",
    "studioActionText": "Casting Director stages 200 extras for the ballroom scene!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 3,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 14,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 34,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q156_extras_casting_roster",
    "stage": 1,
    "title": "Stage 1: Extras Casting Roster",
    "scenario": "Extras Casting Roster on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Featured Extras to Background Crowd is 3 : 8. If there are 48 Background Crowd, how many Featured Extras are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "Featured Extras",
    "labelB": "Background Crowd",
    "targetQuantityName": "Featured Extras",
    "givenQuantityName": "Background Crowd",
    "givenQuantityValue": 48,
    "correctAnswer": 18,
    "correctUnit": "people",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "48 Background Crowd represents a scale multiplier of 6 (48 ÷ 8 = 6). Multiplying 3 × 6 = 18 people (Ratio 3 : 8 = 18 : 48).",
    "studioActionText": "Casting Director stages 200 extras for the ballroom scene!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 6,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q157_film_reel_storage_cases",
    "stage": 2,
    "title": "Stage 2: Film Reel Storage Cases",
    "scenario": "Film Reel Storage Cases on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Master Hard Drives to Archival LTO Tapes is 3 : 8. If there are 60 Master Hard Drives, how many Archival LTO Tapes are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "Master Hard Drives",
    "labelB": "Archival LTO Tapes",
    "targetQuantityName": "Archival LTO Tapes",
    "givenQuantityName": "Master Hard Drives",
    "givenQuantityValue": 60,
    "correctAnswer": 160,
    "correctUnit": "tapes",
    "options": [
      80,
      120,
      160,
      200
    ],
    "unitRateExplanation": "60 Master Hard Drives represents a scale multiplier of 20 (60 ÷ 3 = 20). Multiplying 8 × 20 = 160 tapes (Ratio 3 : 8 = 60 : 160).",
    "studioActionText": "Digital Image Tech safely backs up daily 8K footage!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 20,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 80,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 200,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q158_film_reel_storage_cases",
    "stage": 3,
    "title": "Stage 3: Film Reel Storage Cases",
    "scenario": "Film Reel Storage Cases on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Master Hard Drives to Archival LTO Tapes is 1 : 2. If there are 8 Archival LTO Tapes, how many Master Hard Drives are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Master Hard Drives",
    "labelB": "Archival LTO Tapes",
    "targetQuantityName": "Master Hard Drives",
    "givenQuantityName": "Archival LTO Tapes",
    "givenQuantityValue": 8,
    "correctAnswer": 4,
    "correctUnit": "tapes",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "8 Archival LTO Tapes represents a scale multiplier of 4 (8 ÷ 2 = 4). Multiplying 1 × 4 = 4 tapes (Ratio 1 : 2 = 4 : 8).",
    "studioActionText": "Digital Image Tech safely backs up daily 8K footage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 4,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q159_film_reel_storage_cases",
    "stage": 4,
    "title": "Stage 4: Film Reel Storage Cases",
    "scenario": "Film Reel Storage Cases on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Master Hard Drives to Archival LTO Tapes is 1 : 3. If there are 7 Master Hard Drives, how many Archival LTO Tapes are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Master Hard Drives",
    "labelB": "Archival LTO Tapes",
    "targetQuantityName": "Archival LTO Tapes",
    "givenQuantityName": "Master Hard Drives",
    "givenQuantityValue": 7,
    "correctAnswer": 21,
    "correctUnit": "tapes",
    "options": [
      11,
      16,
      21,
      26
    ],
    "unitRateExplanation": "7 Master Hard Drives represents a scale multiplier of 7 (7 ÷ 1 = 7). Multiplying 3 × 7 = 21 tapes (Ratio 1 : 3 = 7 : 21).",
    "studioActionText": "Digital Image Tech safely backs up daily 8K footage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 7,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 11,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 26,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q160_film_reel_storage_cases",
    "stage": 5,
    "title": "Stage 5: Film Reel Storage Cases",
    "scenario": "Film Reel Storage Cases on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Master Hard Drives to Archival LTO Tapes is 1 : 4. If there are 40 Archival LTO Tapes, how many Master Hard Drives are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "Master Hard Drives",
    "labelB": "Archival LTO Tapes",
    "targetQuantityName": "Master Hard Drives",
    "givenQuantityName": "Archival LTO Tapes",
    "givenQuantityValue": 40,
    "correctAnswer": 10,
    "correctUnit": "tapes",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "40 Archival LTO Tapes represents a scale multiplier of 10 (40 ÷ 4 = 10). Multiplying 1 × 10 = 10 tapes (Ratio 1 : 4 = 10 : 40).",
    "studioActionText": "Digital Image Tech safely backs up daily 8K footage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 10,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q161_color_grading_tint_balance",
    "stage": 1,
    "title": "Stage 1: Color Grading Tint Balance",
    "scenario": "Color Grading Tint Balance on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Shadow Cool Tint to Highlight Warm Tint is 4 : 1. If there are 40 Shadow Cool Tint, how many Highlight Warm Tint are needed?",
    "ratioA": 4,
    "ratioB": 1,
    "labelA": "Shadow Cool Tint",
    "labelB": "Highlight Warm Tint",
    "targetQuantityName": "Highlight Warm Tint",
    "givenQuantityName": "Shadow Cool Tint",
    "givenQuantityValue": 40,
    "correctAnswer": 10,
    "correctUnit": "units",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "40 Shadow Cool Tint represents a scale multiplier of 10 (40 ÷ 4 = 10). Multiplying 1 × 10 = 10 units (Ratio 4 : 1 = 40 : 10).",
    "studioActionText": "Colorist masters rich cinematic film color grading!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 1,
      "multiplier": 10,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q162_color_grading_tint_balance",
    "stage": 2,
    "title": "Stage 2: Color Grading Tint Balance",
    "scenario": "Color Grading Tint Balance on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Shadow Cool Tint to Highlight Warm Tint is 5 : 2. If there are 40 Highlight Warm Tint, how many Shadow Cool Tint are needed?",
    "ratioA": 5,
    "ratioB": 2,
    "labelA": "Shadow Cool Tint",
    "labelB": "Highlight Warm Tint",
    "targetQuantityName": "Shadow Cool Tint",
    "givenQuantityName": "Highlight Warm Tint",
    "givenQuantityValue": 40,
    "correctAnswer": 100,
    "correctUnit": "units",
    "options": [
      50,
      75,
      100,
      125
    ],
    "unitRateExplanation": "40 Highlight Warm Tint represents a scale multiplier of 20 (40 ÷ 2 = 20). Multiplying 5 × 20 = 100 units (Ratio 5 : 2 = 100 : 40).",
    "studioActionText": "Colorist masters rich cinematic film color grading!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 2,
      "multiplier": 20,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 50,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 125,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q163_color_grading_tint_balance",
    "stage": 3,
    "title": "Stage 3: Color Grading Tint Balance",
    "scenario": "Color Grading Tint Balance on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Shadow Cool Tint to Highlight Warm Tint is 4 : 3. If there are 16 Shadow Cool Tint, how many Highlight Warm Tint are needed?",
    "ratioA": 4,
    "ratioB": 3,
    "labelA": "Shadow Cool Tint",
    "labelB": "Highlight Warm Tint",
    "targetQuantityName": "Highlight Warm Tint",
    "givenQuantityName": "Shadow Cool Tint",
    "givenQuantityValue": 16,
    "correctAnswer": 12,
    "correctUnit": "units",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "16 Shadow Cool Tint represents a scale multiplier of 4 (16 ÷ 4 = 4). Multiplying 3 × 4 = 12 units (Ratio 4 : 3 = 16 : 12).",
    "studioActionText": "Colorist masters rich cinematic film color grading!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 3,
      "multiplier": 4,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q164_color_grading_tint_balance",
    "stage": 4,
    "title": "Stage 4: Color Grading Tint Balance",
    "scenario": "Color Grading Tint Balance on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Shadow Cool Tint to Highlight Warm Tint is 5 : 3. If there are 21 Highlight Warm Tint, how many Shadow Cool Tint are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Shadow Cool Tint",
    "labelB": "Highlight Warm Tint",
    "targetQuantityName": "Shadow Cool Tint",
    "givenQuantityName": "Highlight Warm Tint",
    "givenQuantityValue": 21,
    "correctAnswer": 35,
    "correctUnit": "units",
    "options": [
      18,
      26,
      35,
      44
    ],
    "unitRateExplanation": "21 Highlight Warm Tint represents a scale multiplier of 7 (21 ÷ 3 = 7). Multiplying 5 × 7 = 35 units (Ratio 5 : 3 = 35 : 21).",
    "studioActionText": "Colorist masters rich cinematic film color grading!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 7,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 44,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q165_visual_effects_cgi_layers",
    "stage": 5,
    "title": "Stage 5: Visual Effects CGI Layers",
    "scenario": "Visual Effects CGI Layers on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Foreground Passes to Background CGI Passes is 5 : 3. If there are 10 Foreground Passes, how many Background CGI Passes are needed?",
    "ratioA": 5,
    "ratioB": 3,
    "labelA": "Foreground Passes",
    "labelB": "Background CGI Passes",
    "targetQuantityName": "Background CGI Passes",
    "givenQuantityName": "Foreground Passes",
    "givenQuantityValue": 10,
    "correctAnswer": 6,
    "correctUnit": "passes",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "10 Foreground Passes represents a scale multiplier of 2 (10 ÷ 5 = 2). Multiplying 3 × 2 = 6 passes (Ratio 5 : 3 = 10 : 6).",
    "studioActionText": "VFX Supervisor composites hyper-realistic CGI explosions!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 3,
      "multiplier": 2,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q166_visual_effects_cgi_layers",
    "stage": 1,
    "title": "Stage 1: Visual Effects CGI Layers",
    "scenario": "Visual Effects CGI Layers on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Foreground Passes to Background CGI Passes is 7 : 2. If there are 10 Background CGI Passes, how many Foreground Passes are needed?",
    "ratioA": 7,
    "ratioB": 2,
    "labelA": "Foreground Passes",
    "labelB": "Background CGI Passes",
    "targetQuantityName": "Foreground Passes",
    "givenQuantityName": "Background CGI Passes",
    "givenQuantityValue": 10,
    "correctAnswer": 35,
    "correctUnit": "passes",
    "options": [
      18,
      26,
      35,
      44
    ],
    "unitRateExplanation": "10 Background CGI Passes represents a scale multiplier of 5 (10 ÷ 2 = 5). Multiplying 7 × 5 = 35 passes (Ratio 7 : 2 = 35 : 10).",
    "studioActionText": "VFX Supervisor composites hyper-realistic CGI explosions!",
    "diagram": {
      "blocksA": 7,
      "blocksB": 2,
      "multiplier": 5,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 44,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q167_visual_effects_cgi_layers",
    "stage": 2,
    "title": "Stage 2: Visual Effects CGI Layers",
    "scenario": "Visual Effects CGI Layers on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Foreground Passes to Background CGI Passes is 1 : 6. If there are 8 Foreground Passes, how many Background CGI Passes are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "Foreground Passes",
    "labelB": "Background CGI Passes",
    "targetQuantityName": "Background CGI Passes",
    "givenQuantityName": "Foreground Passes",
    "givenQuantityValue": 8,
    "correctAnswer": 48,
    "correctUnit": "passes",
    "options": [
      24,
      36,
      48,
      60
    ],
    "unitRateExplanation": "8 Foreground Passes represents a scale multiplier of 8 (8 ÷ 1 = 8). Multiplying 6 × 8 = 48 passes (Ratio 1 : 6 = 8 : 48).",
    "studioActionText": "VFX Supervisor composites hyper-realistic CGI explosions!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 8,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 24,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 60,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q168_visual_effects_cgi_layers",
    "stage": 3,
    "title": "Stage 3: Visual Effects CGI Layers",
    "scenario": "Visual Effects CGI Layers on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Foreground Passes to Background CGI Passes is 2 : 9. If there are 108 Background CGI Passes, how many Foreground Passes are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "Foreground Passes",
    "labelB": "Background CGI Passes",
    "targetQuantityName": "Foreground Passes",
    "givenQuantityName": "Background CGI Passes",
    "givenQuantityValue": 108,
    "correctAnswer": 24,
    "correctUnit": "passes",
    "options": [
      12,
      18,
      24,
      30
    ],
    "unitRateExplanation": "108 Background CGI Passes represents a scale multiplier of 12 (108 ÷ 9 = 12). Multiplying 2 × 12 = 24 passes (Ratio 2 : 9 = 24 : 108).",
    "studioActionText": "VFX Supervisor composites hyper-realistic CGI explosions!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 12,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 12,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 30,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q169_rough_cut_trim_ratios",
    "stage": 4,
    "title": "Stage 4: Rough Cut Trim Ratios",
    "scenario": "Rough Cut Trim Ratios on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Kept Footage (mins) to Trimmed Footage (mins) is 2 : 9. If there are 12 Kept Footage (mins), how many Trimmed Footage (mins) are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "Kept Footage (mins)",
    "labelB": "Trimmed Footage (mins)",
    "targetQuantityName": "Trimmed Footage (mins)",
    "givenQuantityName": "Kept Footage (mins)",
    "givenQuantityValue": 12,
    "correctAnswer": 54,
    "correctUnit": "minutes",
    "options": [
      27,
      41,
      54,
      68
    ],
    "unitRateExplanation": "12 Kept Footage (mins) represents a scale multiplier of 6 (12 ÷ 2 = 6). Multiplying 9 × 6 = 54 minutes (Ratio 2 : 9 = 12 : 54).",
    "studioActionText": "Lead Editor shapes the fast-paced action montage!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 6,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 27,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 68,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q170_rough_cut_trim_ratios",
    "stage": 5,
    "title": "Stage 5: Rough Cut Trim Ratios",
    "scenario": "Rough Cut Trim Ratios on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Kept Footage (mins) to Trimmed Footage (mins) is 3 : 8. If there are 72 Trimmed Footage (mins), how many Kept Footage (mins) are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "Kept Footage (mins)",
    "labelB": "Trimmed Footage (mins)",
    "targetQuantityName": "Kept Footage (mins)",
    "givenQuantityName": "Trimmed Footage (mins)",
    "givenQuantityValue": 72,
    "correctAnswer": 27,
    "correctUnit": "minutes",
    "options": [
      14,
      20,
      27,
      34
    ],
    "unitRateExplanation": "72 Trimmed Footage (mins) represents a scale multiplier of 9 (72 ÷ 8 = 9). Multiplying 3 × 9 = 27 minutes (Ratio 3 : 8 = 27 : 72).",
    "studioActionText": "Lead Editor shapes the fast-paced action montage!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 9,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 14,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 34,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q171_rough_cut_trim_ratios",
    "stage": 1,
    "title": "Stage 1: Rough Cut Trim Ratios",
    "scenario": "Rough Cut Trim Ratios on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Kept Footage (mins) to Trimmed Footage (mins) is 1 : 2. If there are 15 Kept Footage (mins), how many Trimmed Footage (mins) are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Kept Footage (mins)",
    "labelB": "Trimmed Footage (mins)",
    "targetQuantityName": "Trimmed Footage (mins)",
    "givenQuantityName": "Kept Footage (mins)",
    "givenQuantityValue": 15,
    "correctAnswer": 30,
    "correctUnit": "minutes",
    "options": [
      15,
      23,
      30,
      38
    ],
    "unitRateExplanation": "15 Kept Footage (mins) represents a scale multiplier of 15 (15 ÷ 1 = 15). Multiplying 2 × 15 = 30 minutes (Ratio 1 : 2 = 15 : 30).",
    "studioActionText": "Lead Editor shapes the fast-paced action montage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 15,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 15,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 38,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q172_rough_cut_trim_ratios",
    "stage": 2,
    "title": "Stage 2: Rough Cut Trim Ratios",
    "scenario": "Rough Cut Trim Ratios on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Kept Footage (mins) to Trimmed Footage (mins) is 1 : 3. If there are 9 Trimmed Footage (mins), how many Kept Footage (mins) are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Kept Footage (mins)",
    "labelB": "Trimmed Footage (mins)",
    "targetQuantityName": "Kept Footage (mins)",
    "givenQuantityName": "Trimmed Footage (mins)",
    "givenQuantityValue": 9,
    "correctAnswer": 3,
    "correctUnit": "minutes",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "9 Trimmed Footage (mins) represents a scale multiplier of 3 (9 ÷ 3 = 3). Multiplying 1 × 3 = 3 minutes (Ratio 1 : 3 = 3 : 9).",
    "studioActionText": "Lead Editor shapes the fast-paced action montage!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 3,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q173_title_sequence_typography",
    "stage": 3,
    "title": "Stage 3: Title Sequence Typography",
    "scenario": "Title Sequence Typography on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Main Title Seconds to Cast Credits Seconds is 1 : 3. If there are 10 Main Title Seconds, how many Cast Credits Seconds are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Main Title Seconds",
    "labelB": "Cast Credits Seconds",
    "targetQuantityName": "Cast Credits Seconds",
    "givenQuantityName": "Main Title Seconds",
    "givenQuantityValue": 10,
    "correctAnswer": 30,
    "correctUnit": "seconds",
    "options": [
      15,
      23,
      30,
      38
    ],
    "unitRateExplanation": "10 Main Title Seconds represents a scale multiplier of 10 (10 ÷ 1 = 10). Multiplying 3 × 10 = 30 seconds (Ratio 1 : 3 = 10 : 30).",
    "studioActionText": "Motion Graphic Artist renders 3D glowing titles!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 10,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 15,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 38,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q174_title_sequence_typography",
    "stage": 4,
    "title": "Stage 4: Title Sequence Typography",
    "scenario": "Title Sequence Typography on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Main Title Seconds to Cast Credits Seconds is 1 : 4. If there are 80 Cast Credits Seconds, how many Main Title Seconds are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "Main Title Seconds",
    "labelB": "Cast Credits Seconds",
    "targetQuantityName": "Main Title Seconds",
    "givenQuantityName": "Cast Credits Seconds",
    "givenQuantityValue": 80,
    "correctAnswer": 20,
    "correctUnit": "seconds",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "80 Cast Credits Seconds represents a scale multiplier of 20 (80 ÷ 4 = 20). Multiplying 1 × 20 = 20 seconds (Ratio 1 : 4 = 20 : 80).",
    "studioActionText": "Motion Graphic Artist renders 3D glowing titles!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 20,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q175_title_sequence_typography",
    "stage": 5,
    "title": "Stage 5: Title Sequence Typography",
    "scenario": "Title Sequence Typography on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Main Title Seconds to Cast Credits Seconds is 1 : 5. If there are 4 Main Title Seconds, how many Cast Credits Seconds are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Main Title Seconds",
    "labelB": "Cast Credits Seconds",
    "targetQuantityName": "Cast Credits Seconds",
    "givenQuantityName": "Main Title Seconds",
    "givenQuantityValue": 4,
    "correctAnswer": 20,
    "correctUnit": "seconds",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "4 Main Title Seconds represents a scale multiplier of 4 (4 ÷ 1 = 4). Multiplying 5 × 4 = 20 seconds (Ratio 1 : 5 = 4 : 20).",
    "studioActionText": "Motion Graphic Artist renders 3D glowing titles!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 4,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q176_title_sequence_typography",
    "stage": 1,
    "title": "Stage 1: Title Sequence Typography",
    "scenario": "Title Sequence Typography on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Main Title Seconds to Cast Credits Seconds is 2 : 3. If there are 21 Cast Credits Seconds, how many Main Title Seconds are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "Main Title Seconds",
    "labelB": "Cast Credits Seconds",
    "targetQuantityName": "Main Title Seconds",
    "givenQuantityName": "Cast Credits Seconds",
    "givenQuantityValue": 21,
    "correctAnswer": 14,
    "correctUnit": "seconds",
    "options": [
      7,
      11,
      14,
      18
    ],
    "unitRateExplanation": "21 Cast Credits Seconds represents a scale multiplier of 7 (21 ÷ 3 = 7). Multiplying 2 × 7 = 14 seconds (Ratio 2 : 3 = 14 : 21).",
    "studioActionText": "Motion Graphic Artist renders 3D glowing titles!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 7,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 7,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 18,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q177_film_export_compression",
    "stage": 2,
    "title": "Stage 2: Film Export Compression",
    "scenario": "Film Export Compression on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Compressed Gigabytes to Raw Terabytes is 2 : 3. If there are 4 Compressed Gigabytes, how many Raw Terabytes are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "Compressed Gigabytes",
    "labelB": "Raw Terabytes",
    "targetQuantityName": "Raw Terabytes",
    "givenQuantityName": "Compressed Gigabytes",
    "givenQuantityValue": 4,
    "correctAnswer": 6,
    "correctUnit": "GB",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "4 Compressed Gigabytes represents a scale multiplier of 2 (4 ÷ 2 = 2). Multiplying 3 × 2 = 6 GB (Ratio 2 : 3 = 4 : 6).",
    "studioActionText": "Post-Production Tech exports the 4K IMAX digital cinema package!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 2,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q178_film_export_compression",
    "stage": 3,
    "title": "Stage 3: Film Export Compression",
    "scenario": "Film Export Compression on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Compressed Gigabytes to Raw Terabytes is 2 : 5. If there are 25 Raw Terabytes, how many Compressed Gigabytes are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "Compressed Gigabytes",
    "labelB": "Raw Terabytes",
    "targetQuantityName": "Compressed Gigabytes",
    "givenQuantityName": "Raw Terabytes",
    "givenQuantityValue": 25,
    "correctAnswer": 10,
    "correctUnit": "GB",
    "options": [
      5,
      8,
      10,
      13
    ],
    "unitRateExplanation": "25 Raw Terabytes represents a scale multiplier of 5 (25 ÷ 5 = 5). Multiplying 2 × 5 = 10 GB (Ratio 2 : 5 = 10 : 25).",
    "studioActionText": "Post-Production Tech exports the 4K IMAX digital cinema package!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 5,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 5,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 13,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q179_film_export_compression",
    "stage": 4,
    "title": "Stage 4: Film Export Compression",
    "scenario": "Film Export Compression on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Compressed Gigabytes to Raw Terabytes is 3 : 4. If there are 24 Compressed Gigabytes, how many Raw Terabytes are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Compressed Gigabytes",
    "labelB": "Raw Terabytes",
    "targetQuantityName": "Raw Terabytes",
    "givenQuantityName": "Compressed Gigabytes",
    "givenQuantityValue": 24,
    "correctAnswer": 32,
    "correctUnit": "GB",
    "options": [
      16,
      24,
      32,
      40
    ],
    "unitRateExplanation": "24 Compressed Gigabytes represents a scale multiplier of 8 (24 ÷ 3 = 8). Multiplying 4 × 8 = 32 GB (Ratio 3 : 4 = 24 : 32).",
    "studioActionText": "Post-Production Tech exports the 4K IMAX digital cinema package!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 8,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 16,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 40,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q180_film_export_compression",
    "stage": 5,
    "title": "Stage 5: Film Export Compression",
    "scenario": "Film Export Compression on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Compressed Gigabytes to Raw Terabytes is 3 : 5. If there are 60 Raw Terabytes, how many Compressed Gigabytes are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Compressed Gigabytes",
    "labelB": "Raw Terabytes",
    "targetQuantityName": "Compressed Gigabytes",
    "givenQuantityName": "Raw Terabytes",
    "givenQuantityValue": 60,
    "correctAnswer": 36,
    "correctUnit": "GB",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "60 Raw Terabytes represents a scale multiplier of 12 (60 ÷ 5 = 12). Multiplying 3 × 12 = 36 GB (Ratio 3 : 5 = 36 : 60).",
    "studioActionText": "Post-Production Tech exports the 4K IMAX digital cinema package!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 12,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q181_red_carpet_gala_tickets",
    "stage": 1,
    "title": "Stage 1: Red Carpet Gala Tickets",
    "scenario": "Red Carpet Gala Tickets on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of VIP Passes to General Screening Tickets is 1 : 6. If there are 12 VIP Passes, how many General Screening Tickets are needed?",
    "ratioA": 1,
    "ratioB": 6,
    "labelA": "VIP Passes",
    "labelB": "General Screening Tickets",
    "targetQuantityName": "General Screening Tickets",
    "givenQuantityName": "VIP Passes",
    "givenQuantityValue": 12,
    "correctAnswer": 72,
    "correctUnit": "tickets",
    "options": [
      36,
      54,
      72,
      90
    ],
    "unitRateExplanation": "12 VIP Passes represents a scale multiplier of 12 (12 ÷ 1 = 12). Multiplying 6 × 12 = 72 tickets (Ratio 1 : 6 = 12 : 72).",
    "studioActionText": "Event Host rolls out the crimson red carpet for the gala premiere!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 6,
      "multiplier": 12,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 36,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 90,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q182_red_carpet_gala_tickets",
    "stage": 2,
    "title": "Stage 2: Red Carpet Gala Tickets",
    "scenario": "Red Carpet Gala Tickets on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of VIP Passes to General Screening Tickets is 2 : 9. If there are 18 General Screening Tickets, how many VIP Passes are needed?",
    "ratioA": 2,
    "ratioB": 9,
    "labelA": "VIP Passes",
    "labelB": "General Screening Tickets",
    "targetQuantityName": "VIP Passes",
    "givenQuantityName": "General Screening Tickets",
    "givenQuantityValue": 18,
    "correctAnswer": 4,
    "correctUnit": "tickets",
    "options": [
      2,
      3,
      4,
      5
    ],
    "unitRateExplanation": "18 General Screening Tickets represents a scale multiplier of 2 (18 ÷ 9 = 2). Multiplying 2 × 2 = 4 tickets (Ratio 2 : 9 = 4 : 18).",
    "studioActionText": "Event Host rolls out the crimson red carpet for the gala premiere!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 9,
      "multiplier": 2,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 2,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 5,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q183_red_carpet_gala_tickets",
    "stage": 3,
    "title": "Stage 3: Red Carpet Gala Tickets",
    "scenario": "Red Carpet Gala Tickets on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of VIP Passes to General Screening Tickets is 3 : 8. If there are 15 VIP Passes, how many General Screening Tickets are needed?",
    "ratioA": 3,
    "ratioB": 8,
    "labelA": "VIP Passes",
    "labelB": "General Screening Tickets",
    "targetQuantityName": "General Screening Tickets",
    "givenQuantityName": "VIP Passes",
    "givenQuantityValue": 15,
    "correctAnswer": 40,
    "correctUnit": "tickets",
    "options": [
      20,
      30,
      40,
      50
    ],
    "unitRateExplanation": "15 VIP Passes represents a scale multiplier of 5 (15 ÷ 3 = 5). Multiplying 8 × 5 = 40 tickets (Ratio 3 : 8 = 15 : 40).",
    "studioActionText": "Event Host rolls out the crimson red carpet for the gala premiere!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 8,
      "multiplier": 5,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 20,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 50,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q184_red_carpet_gala_tickets",
    "stage": 4,
    "title": "Stage 4: Red Carpet Gala Tickets",
    "scenario": "Red Carpet Gala Tickets on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of VIP Passes to General Screening Tickets is 1 : 2. If there are 16 General Screening Tickets, how many VIP Passes are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "VIP Passes",
    "labelB": "General Screening Tickets",
    "targetQuantityName": "VIP Passes",
    "givenQuantityName": "General Screening Tickets",
    "givenQuantityValue": 16,
    "correctAnswer": 8,
    "correctUnit": "tickets",
    "options": [
      4,
      6,
      8,
      10
    ],
    "unitRateExplanation": "16 General Screening Tickets represents a scale multiplier of 8 (16 ÷ 2 = 8). Multiplying 1 × 8 = 8 tickets (Ratio 1 : 2 = 8 : 16).",
    "studioActionText": "Event Host rolls out the crimson red carpet for the gala premiere!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 8,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 4,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 10,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q185_popcorn_concession_bundles",
    "stage": 5,
    "title": "Stage 5: Popcorn Concession Bundles",
    "scenario": "Popcorn Concession Bundles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Large Popcorns to Fountain Drinks is 1 : 2. If there are 3 Large Popcorns, how many Fountain Drinks are needed?",
    "ratioA": 1,
    "ratioB": 2,
    "labelA": "Large Popcorns",
    "labelB": "Fountain Drinks",
    "targetQuantityName": "Fountain Drinks",
    "givenQuantityName": "Large Popcorns",
    "givenQuantityValue": 3,
    "correctAnswer": 6,
    "correctUnit": "drinks",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "3 Large Popcorns represents a scale multiplier of 3 (3 ÷ 1 = 3). Multiplying 2 × 3 = 6 drinks (Ratio 1 : 2 = 3 : 6).",
    "studioActionText": "Cinema Concessions team serves excited moviegoers!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 2,
      "multiplier": 3,
      "totalUnits": 3
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q186_popcorn_concession_bundles",
    "stage": 1,
    "title": "Stage 1: Popcorn Concession Bundles",
    "scenario": "Popcorn Concession Bundles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Large Popcorns to Fountain Drinks is 1 : 3. If there are 18 Fountain Drinks, how many Large Popcorns are needed?",
    "ratioA": 1,
    "ratioB": 3,
    "labelA": "Large Popcorns",
    "labelB": "Fountain Drinks",
    "targetQuantityName": "Large Popcorns",
    "givenQuantityName": "Fountain Drinks",
    "givenQuantityValue": 18,
    "correctAnswer": 6,
    "correctUnit": "drinks",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "18 Fountain Drinks represents a scale multiplier of 6 (18 ÷ 3 = 6). Multiplying 1 × 6 = 6 drinks (Ratio 1 : 3 = 6 : 18).",
    "studioActionText": "Cinema Concessions team serves excited moviegoers!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 3,
      "multiplier": 6,
      "totalUnits": 4
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q187_popcorn_concession_bundles",
    "stage": 2,
    "title": "Stage 2: Popcorn Concession Bundles",
    "scenario": "Popcorn Concession Bundles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Large Popcorns to Fountain Drinks is 1 : 4. If there are 9 Large Popcorns, how many Fountain Drinks are needed?",
    "ratioA": 1,
    "ratioB": 4,
    "labelA": "Large Popcorns",
    "labelB": "Fountain Drinks",
    "targetQuantityName": "Fountain Drinks",
    "givenQuantityName": "Large Popcorns",
    "givenQuantityValue": 9,
    "correctAnswer": 36,
    "correctUnit": "drinks",
    "options": [
      18,
      27,
      36,
      45
    ],
    "unitRateExplanation": "9 Large Popcorns represents a scale multiplier of 9 (9 ÷ 1 = 9). Multiplying 4 × 9 = 36 drinks (Ratio 1 : 4 = 9 : 36).",
    "studioActionText": "Cinema Concessions team serves excited moviegoers!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 4,
      "multiplier": 9,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 45,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q188_popcorn_concession_bundles",
    "stage": 3,
    "title": "Stage 3: Popcorn Concession Bundles",
    "scenario": "Popcorn Concession Bundles on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Large Popcorns to Fountain Drinks is 1 : 5. If there are 75 Fountain Drinks, how many Large Popcorns are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Large Popcorns",
    "labelB": "Fountain Drinks",
    "targetQuantityName": "Large Popcorns",
    "givenQuantityName": "Fountain Drinks",
    "givenQuantityValue": 75,
    "correctAnswer": 15,
    "correctUnit": "drinks",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "75 Fountain Drinks represents a scale multiplier of 15 (75 ÷ 5 = 15). Multiplying 1 × 15 = 15 drinks (Ratio 1 : 5 = 15 : 75).",
    "studioActionText": "Cinema Concessions team serves excited moviegoers!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 15,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q189_premiere_auditorium_seats",
    "stage": 4,
    "title": "Stage 4: Premiere Auditorium Seats",
    "scenario": "Premiere Auditorium Seats on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Balcony Row Seats to Floor Orchestra Seats is 1 : 5. If there are 7 Balcony Row Seats, how many Floor Orchestra Seats are needed?",
    "ratioA": 1,
    "ratioB": 5,
    "labelA": "Balcony Row Seats",
    "labelB": "Floor Orchestra Seats",
    "targetQuantityName": "Floor Orchestra Seats",
    "givenQuantityName": "Balcony Row Seats",
    "givenQuantityValue": 7,
    "correctAnswer": 35,
    "correctUnit": "seats",
    "options": [
      18,
      26,
      35,
      44
    ],
    "unitRateExplanation": "7 Balcony Row Seats represents a scale multiplier of 7 (7 ÷ 1 = 7). Multiplying 5 × 7 = 35 seats (Ratio 1 : 5 = 7 : 35).",
    "studioActionText": "Ushers welcome a full house for the premiere screening!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 5,
      "multiplier": 7,
      "totalUnits": 6
    },
    "misconceptions": [
      {
        "wrongAnswer": 18,
        "reason": "Added numbers directly instead of multiplying by the scale factor 7."
      },
      {
        "wrongAnswer": 44,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q190_premiere_auditorium_seats",
    "stage": 5,
    "title": "Stage 5: Premiere Auditorium Seats",
    "scenario": "Premiere Auditorium Seats on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Balcony Row Seats to Floor Orchestra Seats is 2 : 3. If there are 30 Floor Orchestra Seats, how many Balcony Row Seats are needed?",
    "ratioA": 2,
    "ratioB": 3,
    "labelA": "Balcony Row Seats",
    "labelB": "Floor Orchestra Seats",
    "targetQuantityName": "Balcony Row Seats",
    "givenQuantityName": "Floor Orchestra Seats",
    "givenQuantityValue": 30,
    "correctAnswer": 20,
    "correctUnit": "seats",
    "options": [
      10,
      15,
      20,
      25
    ],
    "unitRateExplanation": "30 Floor Orchestra Seats represents a scale multiplier of 10 (30 ÷ 3 = 10). Multiplying 2 × 10 = 20 seats (Ratio 2 : 3 = 20 : 30).",
    "studioActionText": "Ushers welcome a full house for the premiere screening!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 3,
      "multiplier": 10,
      "totalUnits": 5
    },
    "misconceptions": [
      {
        "wrongAnswer": 10,
        "reason": "Added numbers directly instead of multiplying by the scale factor 10."
      },
      {
        "wrongAnswer": 25,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q191_premiere_auditorium_seats",
    "stage": 1,
    "title": "Stage 1: Premiere Auditorium Seats",
    "scenario": "Premiere Auditorium Seats on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Balcony Row Seats to Floor Orchestra Seats is 2 : 5. If there are 40 Balcony Row Seats, how many Floor Orchestra Seats are needed?",
    "ratioA": 2,
    "ratioB": 5,
    "labelA": "Balcony Row Seats",
    "labelB": "Floor Orchestra Seats",
    "targetQuantityName": "Floor Orchestra Seats",
    "givenQuantityName": "Balcony Row Seats",
    "givenQuantityValue": 40,
    "correctAnswer": 100,
    "correctUnit": "seats",
    "options": [
      50,
      75,
      100,
      125
    ],
    "unitRateExplanation": "40 Balcony Row Seats represents a scale multiplier of 20 (40 ÷ 2 = 20). Multiplying 5 × 20 = 100 seats (Ratio 2 : 5 = 40 : 100).",
    "studioActionText": "Ushers welcome a full house for the premiere screening!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 5,
      "multiplier": 20,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 50,
        "reason": "Added numbers directly instead of multiplying by the scale factor 20."
      },
      {
        "wrongAnswer": 125,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q192_premiere_auditorium_seats",
    "stage": 2,
    "title": "Stage 2: Premiere Auditorium Seats",
    "scenario": "Premiere Auditorium Seats on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Balcony Row Seats to Floor Orchestra Seats is 3 : 4. If there are 16 Floor Orchestra Seats, how many Balcony Row Seats are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Balcony Row Seats",
    "labelB": "Floor Orchestra Seats",
    "targetQuantityName": "Balcony Row Seats",
    "givenQuantityName": "Floor Orchestra Seats",
    "givenQuantityValue": 16,
    "correctAnswer": 12,
    "correctUnit": "seats",
    "options": [
      6,
      9,
      12,
      15
    ],
    "unitRateExplanation": "16 Floor Orchestra Seats represents a scale multiplier of 4 (16 ÷ 4 = 4). Multiplying 3 × 4 = 12 seats (Ratio 3 : 4 = 12 : 16).",
    "studioActionText": "Ushers welcome a full house for the premiere screening!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 4,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 6,
        "reason": "Added numbers directly instead of multiplying by the scale factor 4."
      },
      {
        "wrongAnswer": 15,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q193_movie_poster_print_runs",
    "stage": 3,
    "title": "Stage 3: Movie Poster Print Runs",
    "scenario": "Movie Poster Print Runs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Teaser Posters to Bus Shelter Billboards is 3 : 4. If there are 36 Teaser Posters, how many Bus Shelter Billboards are needed?",
    "ratioA": 3,
    "ratioB": 4,
    "labelA": "Teaser Posters",
    "labelB": "Bus Shelter Billboards",
    "targetQuantityName": "Bus Shelter Billboards",
    "givenQuantityName": "Teaser Posters",
    "givenQuantityValue": 36,
    "correctAnswer": 48,
    "correctUnit": "posters",
    "options": [
      24,
      36,
      48,
      60
    ],
    "unitRateExplanation": "36 Teaser Posters represents a scale multiplier of 12 (36 ÷ 3 = 12). Multiplying 4 × 12 = 48 posters (Ratio 3 : 4 = 36 : 48).",
    "studioActionText": "Marketing Team launches international promotional blitz!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 4,
      "multiplier": 12,
      "totalUnits": 7
    },
    "misconceptions": [
      {
        "wrongAnswer": 24,
        "reason": "Added numbers directly instead of multiplying by the scale factor 12."
      },
      {
        "wrongAnswer": 60,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q194_movie_poster_print_runs",
    "stage": 4,
    "title": "Stage 4: Movie Poster Print Runs",
    "scenario": "Movie Poster Print Runs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Teaser Posters to Bus Shelter Billboards is 3 : 5. If there are 10 Bus Shelter Billboards, how many Teaser Posters are needed?",
    "ratioA": 3,
    "ratioB": 5,
    "labelA": "Teaser Posters",
    "labelB": "Bus Shelter Billboards",
    "targetQuantityName": "Teaser Posters",
    "givenQuantityName": "Bus Shelter Billboards",
    "givenQuantityValue": 10,
    "correctAnswer": 6,
    "correctUnit": "posters",
    "options": [
      3,
      5,
      6,
      8
    ],
    "unitRateExplanation": "10 Bus Shelter Billboards represents a scale multiplier of 2 (10 ÷ 5 = 2). Multiplying 3 × 2 = 6 posters (Ratio 3 : 5 = 6 : 10).",
    "studioActionText": "Marketing Team launches international promotional blitz!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 5,
      "multiplier": 2,
      "totalUnits": 8
    },
    "misconceptions": [
      {
        "wrongAnswer": 3,
        "reason": "Added numbers directly instead of multiplying by the scale factor 2."
      },
      {
        "wrongAnswer": 8,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q195_movie_poster_print_runs",
    "stage": 5,
    "title": "Stage 5: Movie Poster Print Runs",
    "scenario": "Movie Poster Print Runs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Teaser Posters to Bus Shelter Billboards is 4 : 5. If there are 20 Teaser Posters, how many Bus Shelter Billboards are needed?",
    "ratioA": 4,
    "ratioB": 5,
    "labelA": "Teaser Posters",
    "labelB": "Bus Shelter Billboards",
    "targetQuantityName": "Bus Shelter Billboards",
    "givenQuantityName": "Teaser Posters",
    "givenQuantityValue": 20,
    "correctAnswer": 25,
    "correctUnit": "posters",
    "options": [
      13,
      19,
      25,
      31
    ],
    "unitRateExplanation": "20 Teaser Posters represents a scale multiplier of 5 (20 ÷ 4 = 5). Multiplying 5 × 5 = 25 posters (Ratio 4 : 5 = 20 : 25).",
    "studioActionText": "Marketing Team launches international promotional blitz!",
    "diagram": {
      "blocksA": 4,
      "blocksB": 5,
      "multiplier": 5,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 13,
        "reason": "Added numbers directly instead of multiplying by the scale factor 5."
      },
      {
        "wrongAnswer": 31,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q196_movie_poster_print_runs",
    "stage": 1,
    "title": "Stage 1: Movie Poster Print Runs",
    "scenario": "Movie Poster Print Runs on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Teaser Posters to Bus Shelter Billboards is 2 : 7. If there are 56 Bus Shelter Billboards, how many Teaser Posters are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Teaser Posters",
    "labelB": "Bus Shelter Billboards",
    "targetQuantityName": "Teaser Posters",
    "givenQuantityName": "Bus Shelter Billboards",
    "givenQuantityValue": 56,
    "correctAnswer": 16,
    "correctUnit": "posters",
    "options": [
      8,
      12,
      16,
      20
    ],
    "unitRateExplanation": "56 Bus Shelter Billboards represents a scale multiplier of 8 (56 ÷ 7 = 8). Multiplying 2 × 8 = 16 posters (Ratio 2 : 7 = 16 : 56).",
    "studioActionText": "Marketing Team launches international promotional blitz!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 8,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 8."
      },
      {
        "wrongAnswer": 20,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q197_festival_trophy_showcase",
    "stage": 2,
    "title": "Stage 2: Festival Trophy Showcase",
    "scenario": "Festival Trophy Showcase on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Laurels to Gold Trophies is 2 : 7. If there are 6 Silver Laurels, how many Gold Trophies are needed?",
    "ratioA": 2,
    "ratioB": 7,
    "labelA": "Silver Laurels",
    "labelB": "Gold Trophies",
    "targetQuantityName": "Gold Trophies",
    "givenQuantityName": "Silver Laurels",
    "givenQuantityValue": 6,
    "correctAnswer": 21,
    "correctUnit": "trophies",
    "options": [
      11,
      16,
      21,
      26
    ],
    "unitRateExplanation": "6 Silver Laurels represents a scale multiplier of 3 (6 ÷ 2 = 3). Multiplying 7 × 3 = 21 trophies (Ratio 2 : 7 = 6 : 21).",
    "studioActionText": "Director holds aloft the Best Picture Film Festival Award!",
    "diagram": {
      "blocksA": 2,
      "blocksB": 7,
      "multiplier": 3,
      "totalUnits": 9
    },
    "misconceptions": [
      {
        "wrongAnswer": 11,
        "reason": "Added numbers directly instead of multiplying by the scale factor 3."
      },
      {
        "wrongAnswer": 26,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q198_festival_trophy_showcase",
    "stage": 3,
    "title": "Stage 3: Festival Trophy Showcase",
    "scenario": "Festival Trophy Showcase on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Laurels to Gold Trophies is 3 : 7. If there are 42 Gold Trophies, how many Silver Laurels are needed?",
    "ratioA": 3,
    "ratioB": 7,
    "labelA": "Silver Laurels",
    "labelB": "Gold Trophies",
    "targetQuantityName": "Silver Laurels",
    "givenQuantityName": "Gold Trophies",
    "givenQuantityValue": 42,
    "correctAnswer": 18,
    "correctUnit": "trophies",
    "options": [
      9,
      14,
      18,
      23
    ],
    "unitRateExplanation": "42 Gold Trophies represents a scale multiplier of 6 (42 ÷ 7 = 6). Multiplying 3 × 6 = 18 trophies (Ratio 3 : 7 = 18 : 42).",
    "studioActionText": "Director holds aloft the Best Picture Film Festival Award!",
    "diagram": {
      "blocksA": 3,
      "blocksB": 7,
      "multiplier": 6,
      "totalUnits": 10
    },
    "misconceptions": [
      {
        "wrongAnswer": 9,
        "reason": "Added numbers directly instead of multiplying by the scale factor 6."
      },
      {
        "wrongAnswer": 23,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q199_festival_trophy_showcase",
    "stage": 4,
    "title": "Stage 4: Festival Trophy Showcase",
    "scenario": "Festival Trophy Showcase on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Laurels to Gold Trophies is 5 : 6. If there are 45 Silver Laurels, how many Gold Trophies are needed?",
    "ratioA": 5,
    "ratioB": 6,
    "labelA": "Silver Laurels",
    "labelB": "Gold Trophies",
    "targetQuantityName": "Gold Trophies",
    "givenQuantityName": "Silver Laurels",
    "givenQuantityValue": 45,
    "correctAnswer": 54,
    "correctUnit": "trophies",
    "options": [
      27,
      41,
      54,
      68
    ],
    "unitRateExplanation": "45 Silver Laurels represents a scale multiplier of 9 (45 ÷ 5 = 9). Multiplying 6 × 9 = 54 trophies (Ratio 5 : 6 = 45 : 54).",
    "studioActionText": "Director holds aloft the Best Picture Film Festival Award!",
    "diagram": {
      "blocksA": 5,
      "blocksB": 6,
      "multiplier": 9,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 27,
        "reason": "Added numbers directly instead of multiplying by the scale factor 9."
      },
      {
        "wrongAnswer": 68,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  },
  {
    "id": "q200_festival_trophy_showcase",
    "stage": 5,
    "title": "Stage 5: Festival Trophy Showcase",
    "scenario": "Festival Trophy Showcase on Studio Soundstage.",
    "mathPrompt": "In the film studio, the ratio of Silver Laurels to Gold Trophies is 1 : 10. If there are 150 Gold Trophies, how many Silver Laurels are needed?",
    "ratioA": 1,
    "ratioB": 10,
    "labelA": "Silver Laurels",
    "labelB": "Gold Trophies",
    "targetQuantityName": "Silver Laurels",
    "givenQuantityName": "Gold Trophies",
    "givenQuantityValue": 150,
    "correctAnswer": 15,
    "correctUnit": "trophies",
    "options": [
      8,
      11,
      15,
      19
    ],
    "unitRateExplanation": "150 Gold Trophies represents a scale multiplier of 15 (150 ÷ 10 = 15). Multiplying 1 × 15 = 15 trophies (Ratio 1 : 10 = 15 : 150).",
    "studioActionText": "Director holds aloft the Best Picture Film Festival Award!",
    "diagram": {
      "blocksA": 1,
      "blocksB": 10,
      "multiplier": 15,
      "totalUnits": 11
    },
    "misconceptions": [
      {
        "wrongAnswer": 8,
        "reason": "Added numbers directly instead of multiplying by the scale factor 15."
      },
      {
        "wrongAnswer": 19,
        "reason": "Used an incorrect scale multiplier."
      }
    ]
  }
];

/** Sample 5 balanced questions (one per stage 1..5) from the master 160+ pool */
export function sampleRandomRatioQuestions(pool: RatioQuestion[] = RATIO_QUESTIONS): RatioQuestion[] {
  const stages = [1, 2, 3, 4, 5];
  const selected: RatioQuestion[] = [];
  
  stages.forEach((stageNum) => {
    const candidates = pool.filter((q) => q.stage === stageNum);
    if (candidates.length > 0) {
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      selected.push(picked);
    } else {
      const randomQ = pool[Math.floor(Math.random() * pool.length)] || pool[0];
      selected.push({ ...randomQ, stage: stageNum, title: `Stage ${stageNum}: ${randomQ.title.replace(/^Stage \d+:\s*/, '')}` });
    }
  });

  return selected;
}
