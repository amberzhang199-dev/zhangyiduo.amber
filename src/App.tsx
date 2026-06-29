import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from './store/agentStore';
import type { Pet, Species, PetMode } from './store/types';
import type { QuizOption, QuizQuestion } from './data/mbtiQuestions';
import { mbtiQuestions } from './data/mbtiQuestions';
import { compileMbtiResult } from './lib/mbtiScoring';
import { nanoid } from 'nanoid';

// ─────────────────────────────────────────────────────
// Registration data bridge (module-level, survives
// across step transitions without polluting the store)
// ─────────────────────────────────────────────────────
interface PetDraft {
  name: string;
  species: Species | null;
}

let _regCache: { drafts: PetDraft[] } = { drafts: [] };

// ─────────────────────────────────────────────────────
// Async question loader (simulates future API fetch)
// ─────────────────────────────────────────────────────
async function loadMbtiQuestions(): Promise<QuizQuestion[]> {
  await new Promise((r) => setTimeout(r, 120));
  return mbtiQuestions;
}

// ─────────────────────────────────────────────────────
// Step 1 · Mode Selection
// ─────────────────────────────────────────────────────
function ModeSelectModal() {
  const { setMode, setStep } = useAgentStore();

  function pick(mode: PetMode) {
    setMode(mode);
    setStep('registration');
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(74,62,61,0.35)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.4 } }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative w-full max-w-sm"
      >
        <div
          className="relative bg-paper rounded-3xl p-8 border border-border"
          style={{ boxShadow: '0 8px 32px rgba(74,62,61,0.12), 0 2px 8px rgba(74,62,61,0.06)' }}
        >
          {/* decorative tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-orange/20 rounded-sm rotate-[-2deg]" />

          <div className="text-center mb-8 mt-2">
            <h1 className="text-2xl font-bold text-ink mb-2">欢迎来到 JOY PET 🐾</h1>
            <p className="text-ink-light text-sm">选择你的家庭模式，开始探索毛孩子的性格</p>
          </div>

          <div className="flex flex-col gap-4">
            <ModeCard emoji="👶" title="独生子女模式" desc="一只毛孩子，独占你的全部爱" onClick={() => pick('single')} />
            <ModeCard emoji="🏡" title="多宝家庭模式" desc="两只毛孩子，欢乐加倍" onClick={() => pick('multi')} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModeCard({ emoji, title, desc, onClick }: { emoji: string; title: string; desc: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full p-5 rounded-3xl border border-border bg-cream cursor-pointer text-left transition-all hover:border-orange/40 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{emoji}</span>
        <div>
          <p className="font-bold text-ink text-base">{title}</p>
          <p className="text-ink-faint text-xs mt-0.5">{desc}</p>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────
// Step 2 · Registration (names + species)
// ─────────────────────────────────────────────────────
function RegistrationStep() {
  const { mode, setStep } = useAgentStore();
  const isSingle = mode === 'single';

  const [petA, setPetA] = useState<PetDraft>({ name: '', species: null });
  const [petB, setPetB] = useState<PetDraft>({ name: '', species: null });
  const [error, setError] = useState('');

  function handleContinue() {
    if (!petA.name.trim() || !petA.species) {
      setError('请完善宝贝一的信息');
      return;
    }
    if (!isSingle && (!petB.name.trim() || !petB.species)) {
      setError('请完善宝贝二的信息');
      return;
    }
    _regCache = { drafts: isSingle ? [petA] : [petA, petB] };
    setError('');
    setStep('mbti_quiz');
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(74,62,61,0.35)' }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.4 } }}
    >
      <div className="w-full max-w-sm my-8">
        <div className="bg-paper rounded-3xl p-6 border border-border" style={{ boxShadow: '0 8px 32px rgba(74,62,61,0.12)' }}>
          <h2 className="text-xl font-bold text-ink text-center mb-6">
            {isSingle ? '认识你的宝贝 🐾' : '介绍你的两只宝贝 🐾'}
          </h2>

          <div className="flex flex-col space-y-4">
            <PetInputCard label={isSingle ? '你的宝贝' : '宝贝一'} value={petA} onChange={setPetA} />
            {!isSingle && <PetInputCard label="宝贝二" value={petB} onChange={setPetB} />}
          </div>

          {error && <p className="text-orange text-xs text-center mt-3">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleContinue}
            className="w-full mt-6 py-3.5 bg-orange text-white font-bold rounded-full cursor-pointer text-base shadow-lg shadow-orange/25 hover:bg-orange-dark transition-colors"
          >
            开始性格测试 →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PetInputCard({ label, value, onChange }: { label: string; value: PetDraft; onChange: (v: PetDraft) => void }) {
  return (
    <div className="bg-cream rounded-3xl p-4 border border-border">
      <p className="text-sm font-semibold text-ink mb-3">{label}</p>
      <input
        type="text"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        placeholder="请输入它的名字"
        className="w-full px-4 py-3 rounded-2xl border border-border bg-paper text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all"
      />
      <div className="flex gap-3 mt-3">
        <SpeciesBtn emoji="🐱" label="猫猫" active={value.species === 'cat'} onClick={() => onChange({ ...value, species: 'cat' })} />
        <SpeciesBtn emoji="🐶" label="狗狗" active={value.species === 'dog'} onClick={() => onChange({ ...value, species: 'dog' })} />
      </div>
    </div>
  );
}

function SpeciesBtn({ emoji, label, active, onClick }: { emoji: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex-1 py-3 rounded-2xl border-2 cursor-pointer text-center transition-all ${
        active ? 'border-orange bg-orange/10 shadow-sm' : 'border-border bg-paper hover:border-orange/30'
      }`}
    >
      <span className="text-2xl block">{emoji}</span>
      <span className={`text-xs mt-1 block font-medium ${active ? 'text-orange-dark' : 'text-ink-light'}`}>{label}</span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────
// Step 2b · MBTI Quiz (12 questions, single-focus)
// ─────────────────────────────────────────────────────
function MBTIQuizStep() {
  const { mode, setStep, addPet } = useAgentStore();
  const isSingle = mode === 'single';
  const totalPets = isSingle ? 1 : 2;

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [petIdx, setPetIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[][]>([[], []]);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    loadMbtiQuestions().then(setQuestions);
  }, []);

  if (!questions) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(74,62,61,0.35)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-paper rounded-3xl p-8 border border-border text-center" style={{ boxShadow: '0 8px 32px rgba(74,62,61,0.12)' }}>
          <span className="text-3xl block mb-3 animate-bounce">🐾</span>
          <p className="text-ink-light text-sm">题目加载中...</p>
        </div>
      </motion.div>
    );
  }

  const totalQ = questions.length;
  const overallProgress = ((petIdx * totalQ + qIdx) / (totalPets * totalQ)) * 100;
  const question = questions[qIdx];
  const currentDraftName = _regCache.drafts[petIdx]?.name || `宝贝${petIdx + 1}`;

  function handleAnswer(option: QuizOption) {
    if (transitioning) return;
    setTransitioning(true);

    const next = [...answers];
    next[petIdx] = [...next[petIdx], option];
    setAnswers(next);

    setTimeout(() => {
      if (qIdx < totalQ - 1) {
        setQIdx((q) => q + 1);
      } else if (petIdx < totalPets - 1) {
        setPetIdx((p) => p + 1);
        setQIdx(0);
      } else {
        finalize(next);
        return;
      }
      setTransitioning(false);
    }, 350);
  }

  function finalize(finalAnswers: QuizOption[][]) {
    for (let i = 0; i < totalPets; i++) {
      const draft = _regCache.drafts[i];
      const profile = compileMbtiResult(finalAnswers[i], mode);
      const pet: Pet = {
        id: nanoid(10),
        name: draft?.name || `宝贝${i + 1}`,
        species: draft?.species || 'cat',
        mbti_profile: profile,
        chat_history: [],
      };
      addPet(pet);
    }
    setStep('chat_active');
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(74,62,61,0.35)' }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.4 } }}
    >
      <div className="w-full max-w-sm">
        <div className="bg-paper rounded-3xl p-6 border border-border" style={{ boxShadow: '0 8px 32px rgba(74,62,61,0.12)' }}>
          {/* pet indicator for multi mode */}
          {!isSingle && (
            <div className="flex items-center justify-center gap-2 mb-3">
              {_regCache.drafts.map((d, i) => (
                <span
                  key={i}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                    i === petIdx ? 'bg-orange/15 text-orange-dark' : 'bg-cream-dark text-ink-faint'
                  }`}
                >
                  {d.species === 'dog' ? '🐶' : '🐱'} {d.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-faint font-medium">
              {currentDraftName} · 第 {qIdx + 1}/{totalQ} 题
            </span>
            <span className="text-xs text-orange font-bold">{Math.round(overallProgress)}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-cream-dark overflow-hidden mb-6">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange to-orange-light"
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${petIdx}-${qIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-base font-semibold text-ink leading-relaxed mb-5">
                {question.question}
              </p>
              <div className="flex flex-col gap-3">
                {question.options.map((opt) => (
                  <motion.button
                    key={opt.key}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(opt)}
                    className="w-full p-4 rounded-3xl border border-border bg-cream text-left cursor-pointer transition-all hover:border-orange/40 hover:bg-orange/5 text-sm text-ink leading-relaxed"
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// Step 3 · Chat Shell (Agent conversation UI)
// ─────────────────────────────────────────────────────
function ChatShell() {
  const { mode, pets } = useAgentStore();
  const isSingle = mode === 'single';
  const [inputValue, setInputValue] = useState('');

  const chatTitle = isSingle
    ? `与 ${pets[0]?.name || '宝贝'} 的专属秘密基地 💖`
    : `${pets[0]?.name || 'A'}&${pets[1]?.name || 'B'} 的温馨家庭群 🏡`;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-cream">
      {/* Navigation header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-paper border-b border-border flex-shrink-0">
        <div className="flex -space-x-2">
          {pets.map((pet) => (
            <div key={pet.id} className="relative w-10 h-10 rounded-full bg-cream-dark border-2 border-paper flex items-center justify-center text-lg">
              {pet.species === 'cat' ? '🐱' : '🐶'}
              <span className="absolute -bottom-1 -right-1 text-[8px] bg-orange text-white px-1 py-0.5 rounded-full font-bold leading-none">
                {pet.mbti_profile.final_type}
              </span>
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-ink truncate">{chatTitle}</p>
          <p className="text-[10px] text-ink-faint">
            {pets.map((p) => `${p.mbti_profile.final_type}`).join(' · ')}
          </p>
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center">
          <span className="text-xs text-ink-faint bg-cream-dark px-3 py-1.5 rounded-full">
            🎉 冷启动完成，对话模式已激活
          </span>
        </div>

        {pets.map((pet) => (
          <div key={pet.id} className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center text-sm flex-shrink-0 border border-border">
              {pet.species === 'cat' ? '🐱' : '🐶'}
            </div>
            <div className="bg-paper rounded-3xl rounded-tl-lg px-4 py-3 border border-border max-w-[80%]">
              <p className="text-xs text-orange font-bold mb-1">{pet.name}</p>
              <p className="text-sm text-ink leading-relaxed">{getWelcomeMsg(pet)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 bg-paper border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="说点什么吧..."
            className="flex-1 px-4 py-3 rounded-full border border-border bg-cream text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-orange flex items-center justify-center cursor-pointer shadow-md shadow-orange/25 flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </motion.button>
        </div>
      </div>

      <DebugResetPanel />
    </div>
  );
}

function getWelcomeMsg(pet: Pet): string {
  const msgs: Record<string, string> = {
    INTJ: '......我在。有事说事，没事我继续独处。',
    INFJ: '主人，我一直在默默感受你的情绪呢。',
    INTP: '嗯...今天的光影很有意思（发呆中）',
    INFP: '主人～我做了一个好长好长的梦...',
    ENTJ: '好了，我来了。今天的计划是什么？',
    ENFJ: '主人！你今天开心吗？我超想听你说话！',
    ENTP: '哟～有什么新鲜事吗？让我来搞点事情！',
    ENFP: '哇啊啊啊！终于可以聊天了！我超兴奋的！！',
    ISTJ: '嗯。一切正常。该吃饭了。',
    ISFJ: '主人，你今天要记得多喝水哦...',
    ISTP: '...（抬头看你一眼，继续舔爪子）',
    ISFP: '阳光好暖...主人，你闻到花香了吗？',
    ESTJ: '报告！今日巡逻完毕，一切安全！',
    ESFJ: '大家好！我是这个群里最热情的！来来来~',
    ESTP: '嘿！刚才我在沙发上发现了个超好玩的洞！',
    ESFP: '派对开始了吗？！音乐在哪？零食在哪？',
  };
  return msgs[pet.mbti_profile.final_type] || `喵/汪！我是${pet.name}，很高兴认识你！`;
}

// ─────────────────────────────────────────────────────
// Debug Reset Panel
// ─────────────────────────────────────────────────────
function DebugResetPanel() {
  const [open, setOpen] = useState(false);
  const reset = useAgentStore((s) => s.reset);
  const state = useAgentStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-ink/10 text-[10px] text-ink-faint cursor-pointer hover:bg-ink/20 transition-colors flex items-center justify-center"
          title="Debug"
        >
          ⚙
        </button>
      ) : (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-paper border-t border-border p-3 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-faint font-medium">Debug 面板</span>
            <span className="text-[10px] text-ink-faint font-mono">
              mode={state.mode || 'null'} step={state.currentStep} pets={state.pets.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { reset(); _regCache = { drafts: [] }; setOpen(false); }}
              className="px-3 py-1.5 text-xs bg-orange text-white rounded-full cursor-pointer font-medium hover:bg-orange-dark transition-colors"
            >
              重置状态机 ↺
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs bg-cream text-ink-light rounded-full cursor-pointer border border-border hover:bg-cream-dark transition-colors"
            >
              关闭
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────
function App() {
  const { currentStep } = useAgentStore();

  return (
    <div className="min-h-screen">
      {currentStep === 'chat_active' && <ChatShell />}

      <AnimatePresence mode="wait">
        {currentStep === 'mode_select' && <ModeSelectModal key="mode" />}
        {currentStep === 'registration' && <RegistrationStep key="reg" />}
        {currentStep === 'mbti_quiz' && <MBTIQuizStep key="quiz" />}
      </AnimatePresence>

      {currentStep !== 'chat_active' && <DebugResetPanel />}
    </div>
  );
}

export default App;
