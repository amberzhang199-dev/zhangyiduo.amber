import type { MBTIProfile, MBTIScores, PetMode } from '../store/types';
import type { QuizOption } from '../data/mbtiQuestions';

export function compileMbtiResult(
  answers: QuizOption[],
  mode: PetMode
): MBTIProfile {
  const scores: MBTIScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, P: 0, J: 0 };

  for (const answer of answers) {
    scores[answer.dimension] += answer.value;
  }

  if (mode === 'single') {
    scores.I += 1;
    scores.T += 1;
  } else if (mode === 'multi') {
    scores.E += 1;
    scores.P += 1;
  }

  const e_i = scores.E >= scores.I ? 'E' : 'I';
  const s_n = scores.S >= scores.N ? 'S' : 'N';
  const t_f = scores.T >= scores.F ? 'T' : 'F';
  const j_p = scores.J >= scores.P ? 'J' : 'P';

  const final_type = `${e_i}${s_n}${t_f}${j_p}`;

  return { scores, final_type };
}
