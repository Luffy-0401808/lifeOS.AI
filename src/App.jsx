import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// CONSTANTS & DATA
// ============================================================

const KRISHNA_TEACHINGS = [
  { id: 1, sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन", translation: "You have the right to perform your actions, but you are not entitled to the fruits of the actions.", lesson: "Focus on the process, not the outcome. Do your work with full dedication today, and results will follow naturally.", category: "Discipline" },
  { id: 2, sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय", translation: "Be steadfast in yoga, O Arjuna. Perform your duty and abandon all attachment to success or failure.", lesson: "When you detach from outcomes, you unlock peak performance. Gyms aren't built for aesthetics — they're built for strength.", category: "Focus" },
  { id: 3, sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्", translation: "Elevate yourself through the power of your mind, and do not degrade yourself, for the mind can be the friend and also the enemy of the self.", lesson: "Your biggest competitor is the version of you from yesterday. Train your mind daily.", category: "Discipline" },
  { id: 4, sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः", translation: "The soul is neither born nor does it die at any time. It is eternal, unbreakable, and cannot be destroyed.", lesson: "Your true self is limitless. Failures are temporary — your potential is permanent.", category: "Courage" },
  { id: 5, sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्", translation: "It is better to perform one's own duties imperfectly than to master the duties of another.", lesson: "Be yourself relentlessly. Your unique path, even with flaws, beats perfectly copying someone else.", category: "Career" },
  { id: 6, sanskrit: "विहाय कामान्यः सर्वान्पुमांश्चरति निःस्पृहः", translation: "One who abandons all desires and acts free from longing, who has no sense of ownership — that person attains peace.", lesson: "True freedom comes from working without attachment. Code, lift, study — for the love of growth, not approval.", category: "Spirituality" },
  { id: 7, sanskrit: "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः", translation: "One who is not disturbed in mind even amidst threefold miseries, who is not elated when there is happiness, and who is free from attachment.", lesson: "Emotional mastery is the ultimate strength. Stay calm in failure, stay humble in success.", category: "Success" },
];

const WORKOUT_SPLITS = {
  "Push Pull Legs": ["Push A (Chest/Shoulders/Triceps)", "Pull A (Back/Biceps)", "Legs A (Quads/Glutes)", "Push B", "Pull B", "Legs B", "Rest"],
  "Upper Lower": ["Upper A", "Lower A", "Rest", "Upper B", "Lower B", "Rest", "Rest"],
  "Arnold Split": ["Chest/Back", "Shoulders/Arms", "Legs", "Chest/Back", "Shoulders/Arms", "Legs", "Rest"],
  "Full Body": ["Full Body A", "Rest", "Full Body B", "Rest", "Full Body C", "Rest", "Rest"],
  "Bro Split": ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Rest"],
};

const EXERCISES = {
  Chest: ["Bench Press", "Incline DB Press", "Cable Fly", "Push-ups", "Dips"],
  Back: ["Pull-ups", "Barbell Row", "Lat Pulldown", "Cable Row", "Deadlift"],
  Shoulders: ["OHP", "Lateral Raises", "Front Raises", "Face Pulls", "Arnold Press"],
  Legs: ["Squat", "Leg Press", "Romanian Deadlift", "Leg Curl", "Calf Raises"],
  Arms: ["Barbell Curl", "Hammer Curl", "Tricep Dips", "Skull Crushers", "Cable Curl"],
  Core: ["Plank", "Hanging Leg Raise", "Cable Crunch", "Russian Twist", "Bicycle Crunch"],
};

const INDIAN_FOODS = [
  { name: "Soya Chunks (100g)", cal: 345, protein: 52, carbs: 33, fat: 0.5 },
  { name: "Paneer (100g)", cal: 265, protein: 18, carbs: 3.4, fat: 20 },
  { name: "Whole Milk (250ml)", cal: 149, protein: 8, carbs: 12, fat: 8 },
  { name: "Curd (100g)", cal: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
  { name: "Oats (100g)", cal: 389, protein: 17, carbs: 66, fat: 7 },
  { name: "Rice (100g cooked)", cal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Roti (1 piece)", cal: 71, protein: 2.6, carbs: 15, fat: 0.4 },
  { name: "Dal (100g cooked)", cal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: "Eggs (1 whole)", cal: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: "Chicken Breast (100g)", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Peanuts (30g)", cal: 170, protein: 7.6, carbs: 5, fat: 14 },
  { name: "Roasted Chana (30g)", cal: 110, protein: 6, carbs: 17, fat: 2 },
];

const AIML_ROADMAP = [
  { stage: 1, title: "Python", topics: ["Variables & Data Types", "Functions & OOP", "File I/O", "Libraries: NumPy, Pandas"], color: "#3B82F6" },
  { stage: 2, title: "DSA", topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"], color: "#8B5CF6" },
  { stage: 3, title: "SQL", topics: ["CRUD Operations", "Joins & Aggregations", "Window Functions", "Query Optimization"], color: "#06B6D4" },
  { stage: 4, title: "Statistics", topics: ["Probability", "Distributions", "Hypothesis Testing", "Bayesian Stats"], color: "#F59E0B" },
  { stage: 5, title: "Linear Algebra", topics: ["Vectors & Matrices", "Eigenvalues", "SVD", "PCA"], color: "#10B981" },
  { stage: 6, title: "Machine Learning", topics: ["Linear/Logistic Regression", "Decision Trees", "SVM", "Ensemble Methods"], color: "#EF4444" },
  { stage: 7, title: "Deep Learning", topics: ["Neural Networks", "CNNs", "RNNs & LSTMs", "Transformers"], color: "#EC4899" },
  { stage: 8, title: "MLOps", topics: ["Docker", "Experiment Tracking", "Model Registry", "Monitoring"], color: "#F97316" },
  { stage: 9, title: "Cloud", topics: ["AWS SageMaker", "GCP Vertex AI", "Azure ML", "Cloud Storage"], color: "#6366F1" },
  { stage: 10, title: "Deployment", topics: ["FastAPI", "Streamlit", "Docker Compose", "CI/CD Pipelines"], color: "#14B8A6" },
];

const HABITS = [
  { id: "gym", name: "Gym", icon: "💪", category: "fitness" },
  { id: "coding", name: "Coding", icon: "💻", category: "career" },
  { id: "reading", name: "Reading", icon: "📚", category: "learning" },
  { id: "meditation", name: "Meditation", icon: "🧘", category: "spiritual" },
  { id: "skincare", name: "Skin Care", icon: "✨", category: "appearance" },
  { id: "sleep11", name: "Sleep Before 11", icon: "🌙", category: "health" },
  { id: "water", name: "Drink 3L Water", icon: "💧", category: "health" },
  { id: "nosugar", name: "No Junk Food", icon: "🥗", category: "health" },
];

const KRISHNA_RESPONSES = {
  stress: "Arjuna, in the Gita (2.14), Krishna teaches: 'The contacts of the senses with sense-objects give rise to feelings of heat and cold, pleasure and pain — they are transient and impermanent. Bear them patiently.' Your exam stress is temporary. Your preparation is permanent. Act now, detach from results, and watch anxiety dissolve into clarity.",
  failure: "Krishna told Arjuna: 'You grieve for those who should not be grieved for' (2.11). Failure is not your identity — it is your teacher. Every successful person you admire has a graveyard of failures beneath their feet. Rise. Act. The soul cannot fail — only strategies can.",
  motivation: "Krishna declares in Chapter 3: 'Let right deeds be thy motive, not the fruit which comes from them.' The most motivated people are those who fall in love with the process — the daily rep, the daily line of code, the daily page. Fall in love with the work. The results are merely a side effect.",
  discipline: "Chapter 6 teaches: 'For those who have conquered the mind, it is their best friend. For those who have failed to do so, the mind is their greatest enemy.' Discipline is not punishment — it is mastery. Every habit you build is a vote for the person you want to become.",
  career: "Krishna guides in Chapter 18: 'Better is one's own dharma, though imperfectly performed, than the dharma of another well performed.' Find your unique genius. Build skills relentlessly. Your career is not a destination — it is a daily practice of showing up as your best self.",
  default: "As Krishna told Arjuna on the battlefield: 'Get up. Fulfill your duty. Fight.' Whatever challenge you face today, the answer is the same: do your work, improve by 1%, and trust the process. The universe rewards those who act with integrity and persistence.",
};

// ============================================================
// UTILITY HOOKS
// ============================================================

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  const set = useCallback((v) => {
    const val = typeof v === "function" ? v(value) : v;
    setValue(val);
    try { window.localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, value]);
  return [value, set];
}

// ============================================================
// DESIGN TOKENS
// ============================================================

const theme = {
  dark: {
    bg: "#0A0A0F",
    surface: "#12121A",
    card: "#1A1A26",
    cardHover: "#1F1F2E",
    border: "#2A2A3E",
    primary: "#6C63FF",
    primaryLight: "#8B85FF",
    accent: "#FF6B6B",
    gold: "#F59E0B",
    green: "#10B981",
    cyan: "#06B6D4",
    text: "#F0F0F8",
    textSecondary: "#9090B0",
    textMuted: "#5A5A7A",
  },
  light: {
    bg: "#F8F8FF",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    cardHover: "#F0F0FA",
    border: "#E0E0F0",
    primary: "#6C63FF",
    primaryLight: "#8B85FF",
    accent: "#FF6B6B",
    gold: "#D97706",
    green: "#059669",
    cyan: "#0891B2",
    text: "#0A0A1A",
    textSecondary: "#4A4A6A",
    textMuted: "#8A8AA8",
  },
};

// ============================================================
// INLINE STYLES GENERATOR
// ============================================================

function useStyles(isDark) {
  const t = isDark ? theme.dark : theme.light;
  return { t };
}

// ============================================================
// SMALL REUSABLE COMPONENTS
// ============================================================

function Card({ children, style, onClick, className }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        padding: "20px",
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, max = 100, color, height = 6, animated = true }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height, overflow: "hidden", width: "100%" }}>
      <div style={{
        height: "100%",
        width: `${pct}%`,
        background: color,
        borderRadius: 999,
        transition: animated ? "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" : "none",
        boxShadow: `0 0 10px ${color}60`,
      }} />
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      padding: "2px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      background: `${color}22`,
      color: color,
      border: `1px solid ${color}44`,
    }}>
      {children}
    </span>
  );
}

function ScoreRing({ score, size = 80, color, label }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={size / 5} fontWeight="800" fontFamily="system-ui">
          {score}
        </text>
      </svg>
      {label && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textAlign: "center" }}>{label}</span>}
    </div>
  );
}

// ============================================================
// NAV ITEMS
// ============================================================

const NAV_ITEMS = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "fitness", icon: "💪", label: "Fitness" },
  { id: "nutrition", icon: "🥗", label: "Nutrition" },
  { id: "sleep", icon: "🌙", label: "Sleep" },
  { id: "habits", icon: "🔥", label: "Habits" },
  { id: "aiml", icon: "🤖", label: "AI/ML" },
  { id: "coding", icon: "💻", label: "Coding" },
  { id: "finance", icon: "💰", label: "Finance" },
  { id: "journal", icon: "📓", label: "Journal" },
  { id: "krishna", icon: "🕉️", label: "Krishna" },
  { id: "goals", icon: "🎯", label: "Goals" },
  { id: "analytics", icon: "📊", label: "Analytics" },
];

// ============================================================
// DASHBOARD MODULE
// ============================================================

function Dashboard({ t, data, setData }) {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const todayKey = new Date().toISOString().split("T")[0];
  const teaching = KRISHNA_TEACHINGS[new Date().getDate() % KRISHNA_TEACHINGS.length];

  const scores = {
    daily: Math.round((data.habits.filter(h => h.completedDates?.includes(todayKey)).length / Math.max(1, data.habits.length)) * 100),
    discipline: data.disciplineScore || 72,
    consistency: data.consistencyScore || 68,
    fitness: data.fitnessScore || 75,
    career: data.careerScore || 65,
    knowledge: data.knowledgeScore || 71,
  };

  const lifeAreas = [
    { label: "Health", value: 78, color: "#10B981" },
    { label: "Wealth", value: 52, color: "#F59E0B" },
    { label: "Career", value: 65, color: "#6C63FF" },
    { label: "Learning", value: 71, color: "#06B6D4" },
    { label: "Spirit", value: 60, color: "#EC4899" },
    { label: "Appearance", value: 80, color: "#F97316" },
    { label: "Productivity", value: 69, color: "#8B5CF6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{today}</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: t.text, margin: 0, letterSpacing: "-0.03em" }}>
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"} 👋
          </h1>
          <p style={{ color: t.textSecondary, margin: "4px 0 0", fontSize: 14 }}>Your life operating system is ready.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: `${t.primary}22`, border: `1px solid ${t.primary}44`, borderRadius: 12, padding: "8px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.primary }}>
              {data.habits.filter(h => h.completedDates?.includes(todayKey)).length}/{data.habits.length}
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>HABITS TODAY</div>
          </div>
        </div>
      </div>

      {/* Score Rings */}
      <div style={{ background: `linear-gradient(135deg, ${t.primary}15, ${t.card})`, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Life Scores</div>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16 }}>
          <ScoreRing score={scores.daily} color={t.gold} label="Daily" />
          <ScoreRing score={scores.discipline} color={t.primary} label="Discipline" />
          <ScoreRing score={scores.consistency} color={t.cyan} label="Consistency" />
          <ScoreRing score={scores.fitness} color={t.green} label="Fitness" />
          <ScoreRing score={scores.career} color={t.accent} label="Career" />
          <ScoreRing score={scores.knowledge} color="#EC4899" label="Knowledge" />
        </div>
      </div>

      {/* Life Areas */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Life Areas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {lifeAreas.map(area => (
            <div key={area.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{area.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: area.color }}>{area.value}%</span>
              </div>
              <ProgressBar value={area.value} color={area.color} height={8} />
            </div>
          ))}
        </div>
      </div>

      {/* Daily Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
        {[
          { label: "Water", value: `${data.waterIntake || 0}L`, target: "3L", icon: "💧", color: t.cyan },
          { label: "Protein", value: `${data.proteinIntake || 0}g`, target: "160g", icon: "🥩", color: "#EF4444" },
          { label: "Sleep", value: `${data.sleepHours || 0}h`, target: "8h", icon: "😴", color: "#8B5CF6" },
          { label: "Steps", value: `${(data.steps || 0).toLocaleString()}`, target: "10k", icon: "👟", color: t.green },
          { label: "Study", value: `${data.studyHours || 0}h`, target: "4h", icon: "📚", color: t.gold },
          { label: "Calories", value: `${data.calories || 0}`, target: "2500", icon: "🔥", color: t.accent },
        ].map(stat => (
          <div key={stat.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: stat.color, letterSpacing: "-0.03em" }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>/ {stat.target}</div>
          </div>
        ))}
      </div>

      {/* Quick Inputs Row */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Quick Log</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { key: "waterIntake", label: "💧 Water (L)", type: "number", step: "0.25", max: 10 },
            { key: "proteinIntake", label: "🥩 Protein (g)", type: "number", step: "5", max: 400 },
            { key: "sleepHours", label: "😴 Sleep (h)", type: "number", step: "0.5", max: 12 },
            { key: "studyHours", label: "📚 Study (h)", type: "number", step: "0.5", max: 16 },
            { key: "steps", label: "👟 Steps", type: "number", step: "500", max: 50000 },
            { key: "calories", label: "🔥 Calories", type: "number", step: "100", max: 5000 },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600, display: "block", marginBottom: 4 }}>{field.label}</label>
              <input
                type={field.type}
                step={field.step}
                max={field.max}
                min={0}
                value={data[field.key] || ""}
                onChange={e => setData(d => ({ ...d, [field.key]: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: "100%", boxSizing: "border-box", background: `${t.primary}15`, border: `1px solid ${t.border}`,
                  borderRadius: 10, padding: "8px 12px", color: t.text, fontSize: 14, fontWeight: 700, outline: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Krishna Quote */}
      <div style={{
        background: `linear-gradient(135deg, #2D1B69, #1A0533)`,
        border: "1px solid #6C63FF44",
        borderRadius: 20, padding: 24,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 100, opacity: 0.06 }}>🕉️</div>
        <div style={{ fontSize: 12, color: "#9090B0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Daily Krishna Wisdom</div>
        <div style={{ fontSize: 15, color: "#C4B5FD", fontStyle: "italic", marginBottom: 8 }}>{teaching.sanskrit}</div>
        <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.6, marginBottom: 8 }}>"{teaching.translation}"</div>
        <div style={{ fontSize: 13, color: "#A78BFA", lineHeight: 1.5 }}>💡 {teaching.lesson}</div>
        <Badge color="#A78BFA">{teaching.category}</Badge>
      </div>
    </div>
  );
}

// ============================================================
// FITNESS MODULE
// ============================================================

function Fitness({ t, data, setData }) {
  const [activeTab, setActiveTab] = useState("workout");
  const [selectedSplit, setSelectedSplit] = useState("Push Pull Legs");
  const [selectedMuscle, setSelectedMuscle] = useState("Chest");
  const [workoutLog, setWorkoutLog] = useLocalStorage("workoutLog", []);
  const [currentSets, setCurrentSets] = useState([{ reps: "", weight: "" }]);
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES.Chest[0]);
  const [bodyStats, setBodyStats] = useLocalStorage("bodyStats", { weight: "", bodyFat: "", chest: "", waist: "", arms: "" });

  const addSet = () => setCurrentSets(s => [...s, { reps: "", weight: "" }]);
  const logWorkout = () => {
    const entry = {
      date: new Date().toISOString(),
      exercise: selectedExercise,
      sets: currentSets.filter(s => s.reps && s.weight),
    };
    setWorkoutLog(l => [entry, ...l.slice(0, 99)]);
    setCurrentSets([{ reps: "", weight: "" }]);
  };

  const inputStyle = {
    background: `${t.primary}15`, border: `1px solid ${t.border}`, borderRadius: 10,
    padding: "8px 12px", color: t.text, fontSize: 14, fontWeight: 700, outline: "none", width: "100%", boxSizing: "border-box"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>💪 Fitness Hub</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["workout", "body", "cardio", "splits"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700,
            fontSize: 13, textTransform: "capitalize",
            background: activeTab === tab ? t.primary : `${t.primary}20`,
            color: activeTab === tab ? "white" : t.textSecondary,
            transition: "all 0.2s",
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === "workout" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Muscle Group Select */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Muscle Group</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.keys(EXERCISES).map(m => (
                <button key={m} onClick={() => { setSelectedMuscle(m); setSelectedExercise(EXERCISES[m][0]); }} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                  background: selectedMuscle === m ? t.green : `${t.green}20`,
                  color: selectedMuscle === m ? "white" : t.textSecondary,
                }}>{m}</button>
              ))}
            </div>
          </div>

          {/* Exercise Select */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Exercise</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EXERCISES[selectedMuscle].map(ex => (
                <button key={ex} onClick={() => setSelectedExercise(ex)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                  background: selectedExercise === ex ? t.primary : `${t.primary}20`,
                  color: selectedExercise === ex ? "white" : t.textSecondary,
                }}>{ex}</button>
              ))}
            </div>
          </div>

          {/* Sets Logger */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 16 }}>📝 Log: {selectedExercise}</div>
            {currentSets.map((set, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, minWidth: 30 }}>Set {i + 1}</span>
                <input placeholder="Reps" type="number" value={set.reps} onChange={e => setCurrentSets(s => s.map((x, j) => j === i ? { ...x, reps: e.target.value } : x))} style={{ ...inputStyle, width: 80 }} />
                <input placeholder="kg" type="number" value={set.weight} onChange={e => setCurrentSets(s => s.map((x, j) => j === i ? { ...x, weight: e.target.value } : x))} style={{ ...inputStyle, width: 80 }} />
                <span style={{ fontSize: 11, color: t.textMuted }}>kg</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={addSet} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px dashed ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontWeight: 600 }}>+ Add Set</button>
              <button onClick={logWorkout} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: t.green, color: "white", cursor: "pointer", fontWeight: 700 }}>✓ Log Workout</button>
            </div>
          </div>

          {/* Recent Workouts */}
          {workoutLog.length > 0 && (
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Workouts</div>
              {workoutLog.slice(0, 5).map((log, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: i < 4 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ fontWeight: 700, color: t.text, fontSize: 14 }}>{log.exercise}</div>
                  <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>
                    {log.sets.map((s, j) => `Set ${j + 1}: ${s.reps} × ${s.weight}kg`).join(" | ")}
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{new Date(log.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "body" && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 16 }}>📏 Body Measurements</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
            {[
              { key: "weight", label: "⚖️ Weight (kg)" },
              { key: "bodyFat", label: "📊 Body Fat (%)" },
              { key: "chest", label: "💪 Chest (cm)" },
              { key: "waist", label: "🎯 Waist (cm)" },
              { key: "arms", label: "💪 Arms (cm)" },
              { key: "height", label: "📏 Height (cm)" },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600, display: "block", marginBottom: 4 }}>{field.label}</label>
                <input type="number" value={bodyStats[field.key] || ""} onChange={e => setBodyStats(s => ({ ...s, [field.key]: e.target.value }))}
                  style={{ ...inputStyle }} />
              </div>
            ))}
          </div>
          <button onClick={() => {}} style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 12, border: "none", background: t.primary, color: "white", fontWeight: 700, cursor: "pointer" }}>
            Save Measurements
          </button>
        </div>
      )}

      {activeTab === "cardio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {[
              { icon: "🚶", label: "Walking", color: t.green },
              { icon: "🏃", label: "Running", color: t.accent },
              { icon: "🚴", label: "Cycling", color: t.cyan },
              { icon: "⚡", label: "HIIT", color: t.gold },
            ].map(c => (
              <div key={c.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20, textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontWeight: 800, color: t.text, fontSize: 15 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Tap to log</div>
              </div>
            ))}
          </div>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {[
                { label: "Weekly Minutes", value: data.cardioMins || 0, target: 150, color: t.green },
                { label: "Cal Burned", value: data.caloriesBurned || 0, target: 3500, color: t.accent },
                { label: "Distance (km)", value: data.distanceKm || 0, target: 30, color: t.cyan },
                { label: "Step Count", value: data.steps || 0, target: 70000, color: t.gold },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, marginBottom: 6 }}>{stat.label}</div>
                  <ProgressBar value={stat.value} max={stat.target} color={stat.color} height={6} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "splits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(WORKOUT_SPLITS).map(([split, days]) => (
            <div key={split} onClick={() => setSelectedSplit(split)} style={{
              background: selectedSplit === split ? `${t.primary}22` : t.card,
              border: `1px solid ${selectedSplit === split ? t.primary : t.border}`,
              borderRadius: 16, padding: 20, cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ fontWeight: 800, color: t.text, fontSize: 15, marginBottom: 10 }}>{split}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {days.map((day, i) => (
                  <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: `${t.primary}20`, color: t.primary, fontWeight: 600 }}>
                    {["M", "T", "W", "T", "F", "S", "S"][i]}: {day}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// NUTRITION MODULE
// ============================================================

function Nutrition({ t, data, setData }) {
  const [mealLog, setMealLog] = useLocalStorage("mealLog", []);
  const [selectedFood, setSelectedFood] = useState(INDIAN_FOODS[0]);
  const [amount, setAmount] = useState(100);
  const [plan, setPlan] = useState("lean_bulk");

  const totals = mealLog.filter(m => m.date === new Date().toISOString().split("T")[0]).reduce(
    (acc, m) => ({ cal: acc.cal + m.cal, protein: acc.protein + m.protein, carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const goals = plan === "lean_bulk" ? { cal: 2800, protein: 160, carbs: 320, fat: 70 }
    : plan === "fat_loss" ? { cal: 2000, protein: 160, carbs: 200, fat: 55 }
    : { cal: 2400, protein: 140, carbs: 280, fat: 60 };

  const addFood = () => {
    const factor = amount / 100;
    const entry = {
      date: new Date().toISOString().split("T")[0],
      name: selectedFood.name,
      amount,
      cal: Math.round(selectedFood.cal * factor),
      protein: Math.round(selectedFood.protein * factor),
      carbs: Math.round(selectedFood.carbs * factor),
      fat: Math.round(selectedFood.fat * factor),
    };
    setMealLog(l => [entry, ...l.slice(0, 199)]);
  };

  const inputStyle = { background: `${t.primary}15`, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px", color: t.text, fontSize: 14, fontWeight: 700, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>🥗 Nutrition Hub</h2>

      {/* Plan Selector */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { id: "lean_bulk", label: "Lean Bulk 💪" },
          { id: "fat_loss", label: "Fat Loss 🔥" },
          { id: "maintenance", label: "Maintain ⚖️" },
        ].map(p => (
          <button key={p.id} onClick={() => setPlan(p.id)} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: plan === p.id ? t.primary : `${t.primary}20`,
            color: plan === p.id ? "white" : t.textSecondary,
          }}>{p.label}</button>
        ))}
      </div>

      {/* Macro Summary */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today's Macros</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Calories", val: totals.cal, goal: goals.cal, color: t.gold, unit: "kcal" },
            { label: "Protein", val: totals.protein, goal: goals.protein, color: "#EF4444", unit: "g" },
            { label: "Carbs", val: totals.carbs, goal: goals.carbs, color: t.cyan, unit: "g" },
            { label: "Fat", val: totals.fat, goal: goals.fat, color: t.accent, unit: "g" },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.val}</div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>/ {m.goal}{m.unit}</div>
              <div style={{ marginTop: 6 }}>
                <ProgressBar value={m.val} max={m.goal} color={m.color} height={5} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Logger */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 14 }}>🍽️ Log Indian Food</div>
        <select value={selectedFood.name} onChange={e => setSelectedFood(INDIAN_FOODS.find(f => f.name === e.target.value))} style={{ ...inputStyle, marginBottom: 10 }}>
          {INDIAN_FOODS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
        </select>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600, display: "block", marginBottom: 4 }}>Amount (g/ml)</label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={inputStyle} />
          </div>
          <div style={{ flex: 1, background: `${t.primary}10`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}>Preview</div>
            <div style={{ fontSize: 13, color: t.text, fontWeight: 700 }}>
              {Math.round(selectedFood.cal * amount / 100)} kcal · {Math.round(selectedFood.protein * amount / 100)}g P
            </div>
          </div>
        </div>
        <button onClick={addFood} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: t.green, color: "white", fontWeight: 700, cursor: "pointer" }}>
          + Add to Log
        </button>
      </div>

      {/* Today's Log */}
      {mealLog.filter(m => m.date === new Date().toISOString().split("T")[0]).length > 0 && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today's Log</div>
          {mealLog.filter(m => m.date === new Date().toISOString().split("T")[0]).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <div>
                <div style={{ fontWeight: 700, color: t.text, fontSize: 13 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{m.amount}g</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: t.gold, fontSize: 13 }}>{m.cal} kcal</div>
                <div style={{ fontSize: 11, color: "#EF4444" }}>{m.protein}g protein</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zinc & Magnesium estimate */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Micronutrients (Estimate)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Zinc", value: "~8mg", goal: "11mg", color: t.cyan },
            { label: "Magnesium", value: "~220mg", goal: "400mg", color: t.green },
            { label: "Fiber", value: `${Math.round(totals.carbs * 0.1)}g`, goal: "30g", color: t.gold },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>/ {m.goal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SLEEP MODULE
// ============================================================

function Sleep({ t }) {
  const [sleepLog, setSleepLog] = useLocalStorage("sleepLog", []);
  const [sleepTime, setSleepTime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");

  const calcDuration = () => {
    const [sh, sm] = sleepTime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);
    let mins = (wh * 60 + wm) - (sh * 60 + sm);
    if (mins < 0) mins += 1440;
    return (mins / 60).toFixed(1);
  };

  const logSleep = () => {
    const entry = { date: new Date().toISOString().split("T")[0], sleep: sleepTime, wake: wakeTime, duration: parseFloat(calcDuration()) };
    setSleepLog(l => [entry, ...l.slice(0, 29)]);
  };

  const inputStyle = { background: `${t.primary}15`, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", color: t.text, fontSize: 16, fontWeight: 700, outline: "none", width: "100%", boxSizing: "border-box" };

  const weeklyData = sleepLog.slice(0, 7);
  const avgSleep = weeklyData.length ? (weeklyData.reduce((s, e) => s + e.duration, 0) / weeklyData.length).toFixed(1) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>🌙 Sleep Tracker</h2>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Avg Sleep", value: `${avgSleep}h`, color: "#8B5CF6", icon: "😴" },
          { label: "Best Night", value: `${Math.max(0, ...weeklyData.map(e => e.duration))}h`, color: t.green, icon: "⭐" },
          { label: "Recovery", value: avgSleep >= 7.5 ? "Good" : avgSleep >= 6 ? "OK" : "Poor", color: avgSleep >= 7.5 ? t.green : avgSleep >= 6 ? t.gold : t.accent, icon: "🔋" },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Logger */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 16 }}>Log Tonight</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600, display: "block", marginBottom: 6 }}>🌙 Sleep Time</label>
            <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600, display: "block", marginBottom: 6 }}>☀️ Wake Time</label>
            <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ background: `${t.primary}15`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, textAlign: "center" }}>
          <span style={{ color: t.textSecondary, fontSize: 13 }}>Duration: </span>
          <span style={{ color: t.primary, fontWeight: 900, fontSize: 18 }}>{calcDuration()} hours</span>
        </div>
        <button onClick={logSleep} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "#8B5CF6", color: "white", fontWeight: 700, cursor: "pointer" }}>
          Save Sleep Log
        </button>
      </div>

      {/* Weekly Chart */}
      {weeklyData.length > 0 && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Last 7 Nights</div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>
            {[...Array(7)].map((_, i) => {
              const entry = weeklyData[6 - i];
              const h = entry ? (entry.duration / 10) * 80 : 0;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", height: h, background: entry ? "#8B5CF6" : `${t.border}`, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                  <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>{entry ? entry.date.slice(-2) : "--"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// HABITS MODULE
// ============================================================

function Habits({ t, data, setData }) {
  const todayKey = new Date().toISOString().split("T")[0];
  const [habits, setHabits] = useLocalStorage("habits", HABITS.map(h => ({ ...h, completedDates: [] })));
  const [newHabit, setNewHabit] = useState("");

  const toggleHabit = (id) => {
    setHabits(h => h.map(habit => {
      if (habit.id !== id) return habit;
      const dates = habit.completedDates || [];
      const done = dates.includes(todayKey);
      return { ...habit, completedDates: done ? dates.filter(d => d !== todayKey) : [...dates, todayKey] };
    }));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits(h => [...h, { id: Date.now().toString(), name: newHabit, icon: "⚡", category: "custom", completedDates: [] }]);
    setNewHabit("");
  };

  const getStreak = (dates) => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split("T")[0];
      if (!dates.includes(key)) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const completedToday = habits.filter(h => (h.completedDates || []).includes(todayKey)).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>🔥 Habit Tracker</h2>
        <div style={{ background: `${t.green}22`, border: `1px solid ${t.green}44`, borderRadius: 10, padding: "6px 14px", fontSize: 14, fontWeight: 800, color: t.green }}>
          {completedToday}/{habits.length}
        </div>
      </div>

      {/* Today's Habits */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {habits.map(habit => {
          const done = (habit.completedDates || []).includes(todayKey);
          const streak = getStreak(habit.completedDates || []);
          const pct = Math.round(((habit.completedDates || []).length / 30) * 100);
          return (
            <div key={habit.id} onClick={() => toggleHabit(habit.id)} style={{
              background: done ? `${t.green}15` : t.card,
              border: `1px solid ${done ? t.green : t.border}`,
              borderRadius: 14, padding: "14px 18px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: done ? t.green : `${t.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
                transition: "all 0.2s",
              }}>
                {done ? "✓" : habit.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: t.text, fontSize: 14 }}>{habit.name}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: streak > 0 ? t.gold : t.textMuted, fontWeight: 600 }}>🔥 {streak} day streak</span>
                  <span style={{ fontSize: 11, color: t.textMuted }}>30d: {pct}%</span>
                </div>
              </div>
              <Badge color={done ? t.green : t.textMuted}>{habit.category}</Badge>
            </div>
          );
        })}
      </div>

      {/* Add Habit */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Add new habit..."
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addHabit()}
          style={{ flex: 1, background: `${t.primary}15`, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", color: t.text, fontSize: 14, fontWeight: 600, outline: "none" }}
        />
        <button onClick={addHabit} style={{ padding: "12px 20px", borderRadius: 12, border: "none", background: t.primary, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 16 }}>+</button>
      </div>

      {/* Heatmap (last 28 days) */}
      {habits.length > 0 && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Activity Heatmap (28 Days)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(28, 1fr)", gap: 3 }}>
            {[...Array(28)].map((_, i) => {
              const d = new Date(); d.setDate(d.getDate() - (27 - i));
              const key = d.toISOString().split("T")[0];
              const count = habits.filter(h => (h.completedDates || []).includes(key)).length;
              const intensity = count / Math.max(1, habits.length);
              return (
                <div key={i} title={`${key}: ${count}/${habits.length} habits`} style={{
                  height: 14, borderRadius: 3,
                  background: count === 0 ? `${t.border}` : `rgba(108, 99, 255, ${0.2 + intensity * 0.8})`,
                }} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// AI/ML ROADMAP MODULE
// ============================================================

function AIML({ t }) {
  const [progress, setProgress] = useLocalStorage("aimlProgress", {});
  const [activeStage, setActiveStage] = useState(null);

  const toggleTopic = (stageId, topic) => {
    const key = `${stageId}-${topic}`;
    setProgress(p => ({ ...p, [key]: !p[key] }));
  };

  const stageProgress = (stage) => {
    const done = stage.topics.filter(t => progress[`${stage.stage}-${t}`]).length;
    return Math.round((done / stage.topics.length) * 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>🤖 AI/ML Roadmap</h2>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: t.primary }}>{AIML_ROADMAP.filter(s => stageProgress(s) === 100).length}/10</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>STAGES DONE</div>
        </div>
        <div style={{ flex: 1 }}>
          <ProgressBar value={AIML_ROADMAP.reduce((sum, s) => sum + stageProgress(s), 0)} max={1000} color={t.primary} height={10} />
          <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 6 }}>Overall Roadmap Progress</div>
        </div>
      </div>

      {AIML_ROADMAP.map(stage => {
        const pct = stageProgress(stage);
        const isOpen = activeStage === stage.stage;
        return (
          <div key={stage.stage} style={{ background: t.card, border: `1px solid ${isOpen ? stage.color : t.border}`, borderRadius: 16, overflow: "hidden", transition: "all 0.2s" }}>
            <div onClick={() => setActiveStage(isOpen ? null : stage.stage)} style={{ padding: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${stage.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: stage.color, fontSize: 15, flexShrink: 0 }}>
                {stage.stage}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: t.text, fontSize: 15 }}>{stage.title}</div>
                <div style={{ marginTop: 6 }}>
                  <ProgressBar value={pct} color={stage.color} height={6} />
                </div>
              </div>
              <div style={{ fontWeight: 800, color: stage.color, fontSize: 14 }}>{pct}%</div>
              <div style={{ color: t.textMuted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</div>
            </div>
            {isOpen && (
              <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${t.border}` }}>
                <div style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {stage.topics.map(topic => {
                    const done = progress[`${stage.stage}-${topic}`];
                    return (
                      <div key={topic} onClick={() => toggleTopic(stage.stage, topic)} style={{
                        display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                        padding: "8px 12px", borderRadius: 10, background: done ? `${stage.color}15` : `${t.border}22`,
                        transition: "all 0.15s",
                      }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: done ? stage.color : "transparent", border: `2px solid ${done ? stage.color : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", flexShrink: 0 }}>
                          {done ? "✓" : ""}
                        </div>
                        <span style={{ fontSize: 14, color: done ? t.text : t.textSecondary, fontWeight: done ? 700 : 500, textDecoration: done ? "line-through" : "none" }}>{topic}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// CODING TRACKER
// ============================================================

function DsaTopicButton({ topic, t }) {
  const [done, setDone] = useLocalStorage(`dsa-${topic}`, false);
  return (
    <button onClick={() => setDone(!done)} style={{
      padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12,
      background: done ? t.green : `${t.green}20`,
      color: done ? "white" : t.textSecondary,
      textDecoration: done ? "line-through" : "none",
    }}>{topic}</button>
  );
}


function Coding({ t }) {
  const [codingLog, setCodingLog] = useLocalStorage("codingLog", {});
  const todayKey = new Date().toISOString().split("T")[0];
  const langs = ["Python", "Java", "C++", "SQL", "JavaScript", "DSA"];

  const updateLog = (lang, field, val) => {
    setCodingLog(l => ({ ...l, [todayKey]: { ...(l[todayKey] || {}), [lang]: { ...((l[todayKey] || {})[lang] || {}), [field]: val } } }));
  };

  const totalHours = Object.values(codingLog).reduce((sum, day) => sum + langs.reduce((s, l) => s + (Number(day[l]?.hours) || 0), 0), 0);
  const totalProblems = Object.values(codingLog).reduce((sum, day) => sum + langs.reduce((s, l) => s + (Number(day[l]?.problems) || 0), 0), 0);

  const inputStyle = { background: `${t.primary}15`, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", color: t.text, fontSize: 13, fontWeight: 700, outline: "none", width: "70px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>💻 Coding Tracker</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Total Hours", value: totalHours.toFixed(1), icon: "⏱️", color: t.primary },
          { label: "Problems Solved", value: totalProblems, icon: "🧩", color: t.green },
          { label: "Day Streak", value: Object.keys(codingLog).length, icon: "🔥", color: t.gold },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today's Log</div>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Language", "Hours", "Problems", "Topic"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 6px", fontSize: 11, color: t.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {langs.map(lang => {
                const day = (codingLog[todayKey] || {})[lang] || {};
                return (
                  <tr key={lang}>
                    <td style={{ padding: "8px 6px", fontWeight: 700, color: t.text, fontSize: 14 }}>{lang}</td>
                    <td style={{ padding: "8px 6px" }}>
                      <input type="number" value={day.hours || ""} onChange={e => updateLog(lang, "hours", e.target.value)} style={inputStyle} placeholder="0" />
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      <input type="number" value={day.problems || ""} onChange={e => updateLog(lang, "problems", e.target.value)} style={inputStyle} placeholder="0" />
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      <input type="text" value={day.topic || ""} onChange={e => updateLog(lang, "topic", e.target.value)} style={{ ...inputStyle, width: 120 }} placeholder="Topic..." />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DSA Tracker */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 14 }}>🧩 DSA Topics</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Arrays", "Strings", "Linked List", "Stack", "Queue", "Binary Search", "Sorting", "Recursion", "Trees", "BST", "Heaps", "Graphs", "BFS/DFS", "DP", "Greedy", "Backtracking", "Tries", "Segment Tree"].map(topic => (
            <DsaTopicButton key={topic} topic={topic} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FINANCE MODULE
// ============================================================

function Finance({ t }) {
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [form, setForm] = useState({ type: "expense", amount: "", category: "Food", note: "" });

  const categories = { income: ["Salary", "Freelance", "Tutoring", "Other"], expense: ["Food", "Education", "Gym", "Entertainment", "Transport", "Skincare", "Other"] };

  const addTransaction = () => {
    if (!form.amount) return;
    setTransactions(t => [{ ...form, date: new Date().toISOString(), id: Date.now() }, ...t]);
    setForm(f => ({ ...f, amount: "", note: "" }));
  };

  const monthTotals = transactions.filter(tx => new Date(tx.date).getMonth() === new Date().getMonth()).reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.income += Number(tx.amount);
      else acc.expense += Number(tx.amount);
      return acc;
    }, { income: 0, expense: 0 }
  );
  const savings = monthTotals.income - monthTotals.expense;

  const inputStyle = { background: `${t.primary}15`, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", color: t.text, fontSize: 14, fontWeight: 600, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>💰 Finance Tracker</h2>

      {/* Monthly Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Income", value: monthTotals.income, color: t.green, icon: "📈" },
          { label: "Expenses", value: monthTotals.expense, color: t.accent, icon: "📉" },
          { label: "Savings", value: savings, color: savings >= 0 ? t.cyan : t.accent, icon: "💎" },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color, marginTop: 4 }}>₹{s.value.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Transaction */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 14 }}>Add Transaction</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["income", "expense"].map(type => (
            <button key={type} onClick={() => setForm(f => ({ ...f, type, category: categories[type][0] }))} style={{
              flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, textTransform: "capitalize",
              background: form.type === type ? (type === "income" ? t.green : t.accent) : `${t.border}33`,
              color: form.type === type ? "white" : t.textSecondary,
            }}>{type === "income" ? "📈 Income" : "📉 Expense"}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} style={inputStyle} />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
            {categories[form.type].map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Note (optional)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} style={inputStyle} />
          <button onClick={addTransaction} style={{ padding: "12px", borderRadius: 12, border: "none", background: form.type === "income" ? t.green : t.accent, color: "white", fontWeight: 700, cursor: "pointer" }}>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Transactions</div>
        {transactions.length === 0 && <div style={{ color: t.textMuted, textAlign: "center", padding: 20 }}>No transactions yet</div>}
        {transactions.slice(0, 15).map(tx => (
          <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
            <div>
              <div style={{ fontWeight: 700, color: t.text, fontSize: 14 }}>{tx.category}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{tx.note || "—"} · {new Date(tx.date).toLocaleDateString()}</div>
            </div>
            <div style={{ fontWeight: 900, color: tx.type === "income" ? t.green : t.accent, fontSize: 15 }}>
              {tx.type === "income" ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// JOURNAL MODULE
// ============================================================

function Journal({ t }) {
  const [entries, setEntries] = useLocalStorage("journalEntries", []);
  const todayKey = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find(e => e.date === todayKey) || { date: todayKey, answers: ["", "", "", "", ""] };
  const [answers, setAnswers] = useState(todayEntry.answers);

  const questions = [
    "Did I fulfill my responsibilities today? What did I accomplish?",
    "Did I waste time unnecessarily? Where did my attention go?",
    "Did I improve physically — gym, movement, nutrition?",
    "Did I improve mentally — learning, reading, coding?",
    "What can I do better tomorrow? My key commitment:",
  ];

  const save = () => {
    setEntries(e => [{ date: todayKey, answers, mood: "reflective" }, ...e.filter(x => x.date !== todayKey)]);
  };

  const textareaStyle = { background: `${t.primary}12`, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", color: t.text, fontSize: 14, fontWeight: 500, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 70, lineHeight: 1.6, fontFamily: "inherit" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>📓 Daily Reflection</h2>
      <div style={{ background: `${t.gold}15`, border: `1px solid ${t.gold}44`, borderRadius: 14, padding: 16, fontSize: 14, color: t.gold, lineHeight: 1.5 }}>
        🕉️ "In the evening, meditate on the events of the day. What was done well? What was not? How can tomorrow be better?" — Inspired by Gita principles
      </div>

      {questions.map((q, i) => (
        <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.primary, marginBottom: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ background: `${t.primary}20`, borderRadius: 6, padding: "2px 8px", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
            {q}
          </div>
          <textarea value={answers[i]} onChange={e => setAnswers(a => a.map((x, j) => j === i ? e.target.value : x))} style={textareaStyle} placeholder="Write your reflection..." />
        </div>
      ))}

      <button onClick={save} style={{ padding: "14px", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${t.primary}, #8B85FF)`, color: "white", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>
        💾 Save Today's Reflection
      </button>

      {/* Past Entries */}
      {entries.filter(e => e.date !== todayKey).length > 0 && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Past Entries</div>
          {entries.filter(e => e.date !== todayKey).slice(0, 7).map(e => (
            <div key={e.date} style={{ padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
              <div style={{ fontWeight: 700, color: t.text, fontSize: 13 }}>{new Date(e.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{e.answers[0]?.slice(0, 80) || "—"}...</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KRISHNA WISDOM MODULE
// ============================================================

function Krishna({ t }) {
  const [activeTab, setActiveTab] = useState("daily");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useLocalStorage("krishnaFavorites", []);

  const today = new Date().getDate() % KRISHNA_TEACHINGS.length;
  const dailyTeaching = KRISHNA_TEACHINGS[today];

  const getKrishnaAnswer = async () => {
    if (!question.trim()) return;
    setLoading(true);

    const lq = question.toLowerCase();
    let key = "default";
    if (lq.includes("stress") || lq.includes("exam") || lq.includes("anxiety")) key = "stress";
    else if (lq.includes("fail") || lq.includes("loss") || lq.includes("mistake")) key = "failure";
    else if (lq.includes("motivat") || lq.includes("lazy") || lq.includes("start")) key = "motivation";
    else if (lq.includes("disciplin") || lq.includes("consistent") || lq.includes("habit")) key = "discipline";
    else if (lq.includes("career") || lq.includes("job") || lq.includes("purpose")) key = "career";

    setTimeout(() => {
      setAnswer(KRISHNA_RESPONSES[key]);
      setLoading(false);
    }, 800);
  };

  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>🕉️ Krishna Wisdom</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["daily", "library", "ask"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, textTransform: "capitalize",
            background: activeTab === tab ? "#6C63FF" : `rgba(108, 99, 255, 0.15)`,
            color: activeTab === tab ? "white" : t.textSecondary,
          }}>{tab === "ask" ? "🙏 Ask Krishna" : tab === "daily" ? "☀️ Daily" : "📚 Library"}</button>
        ))}
      </div>

      {activeTab === "daily" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #1A0533, #2D1B69, #1A0533)", border: "1px solid #A78BFA44", borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, fontSize: 150, opacity: 0.04 }}>🕉️</div>
            <Badge color="#A78BFA">{dailyTeaching.category}</Badge>
            <div style={{ fontSize: 18, color: "#C4B5FD", fontStyle: "italic", marginTop: 16, marginBottom: 12, lineHeight: 1.5 }}>{dailyTeaching.sanskrit}</div>
            <div style={{ fontSize: 15, color: "#E2E8F0", lineHeight: 1.7, marginBottom: 16 }}>"{dailyTeaching.translation}"</div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#A78BFA", fontWeight: 700, marginBottom: 6 }}>💡 PRACTICAL LESSON</div>
              <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.6 }}>{dailyTeaching.lesson}</div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => toggleFav(dailyTeaching.id)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: favorites.includes(dailyTeaching.id) ? "#F59E0B" : "rgba(255,255,255,0.1)", color: "white", fontWeight: 700, cursor: "pointer" }}>
                {favorites.includes(dailyTeaching.id) ? "★ Saved" : "☆ Save"}
              </button>
              <button onClick={() => navigator.clipboard?.writeText(`${dailyTeaching.sanskrit}\n\n"${dailyTeaching.translation}"\n\nLesson: ${dailyTeaching.lesson}`)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "white", fontWeight: 700, cursor: "pointer" }}>
                📋 Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "library" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {KRISHNA_TEACHINGS.map(teaching => (
            <div key={teaching.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <Badge color="#A78BFA">{teaching.category}</Badge>
                <button onClick={() => toggleFav(teaching.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: favorites.includes(teaching.id) ? "#F59E0B" : t.textMuted }}>
                  {favorites.includes(teaching.id) ? "★" : "☆"}
                </button>
              </div>
              <div style={{ fontSize: 14, color: "#A78BFA", fontStyle: "italic", marginBottom: 8 }}>{teaching.sanskrit}</div>
              <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6, marginBottom: 8 }}>"{teaching.translation}"</div>
              <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>💡 {teaching.lesson}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "ask" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", border: "1px solid #6C63FF44", borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#A78BFA", marginBottom: 8 }}>🙏 Ask Krishna Guide</div>
            <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 16 }}>
              Share what's troubling you. Receive guidance rooted in Bhagavad Gita wisdom — for your modern life.
            </div>
            <div style={{ display: "flex", flex: "wrap", gap: 6, marginBottom: 14 }}>
              {["Exam stress", "Career confusion", "Feeling lazy", "Lack of discipline", "Fear of failure"].map(prompt => (
                <button key={prompt} onClick={() => setQuestion(prompt)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "rgba(108, 99, 255, 0.2)", color: "#A78BFA", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{prompt}</button>
              ))}
            </div>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What's on your mind? Ask Krishna anything..."
              rows={3}
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(108, 99, 255, 0.3)", borderRadius: 12, padding: "12px 16px", color: "#E2E8F0", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }}
            />
            <button onClick={getKrishnaAnswer} disabled={loading} style={{ marginTop: 12, width: "100%", padding: "13px", borderRadius: 12, border: "none", background: loading ? "#6C63FF88" : "linear-gradient(135deg, #6C63FF, #A78BFA)", color: "white", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>
              {loading ? "🙏 Seeking wisdom..." : "🕉️ Seek Guidance"}
            </button>
          </div>

          {answer && (
            <div style={{ background: "linear-gradient(135deg, #1A0533, #2D1B69)", border: "1px solid #A78BFA55", borderRadius: 20, padding: 24 }}>
              <div style={{ fontSize: 13, color: "#A78BFA", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>🕉️ Krishna Speaks</div>
              <div style={{ fontSize: 15, color: "#E2E8F0", lineHeight: 1.8 }}>{answer}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// GOALS MODULE
// ============================================================

function Goals({ t }) {
  const [goals, setGoals] = useLocalStorage("goals", []);
  const [form, setForm] = useState({ title: "", timeframe: "daily", category: "fitness" });

  const addGoal = () => {
    if (!form.title.trim()) return;
    setGoals(g => [...g, { ...form, id: Date.now(), done: false, createdAt: new Date().toISOString() }]);
    setForm(f => ({ ...f, title: "" }));
  };
  const toggleGoal = (id) => setGoals(g => g.map(goal => goal.id === id ? { ...goal, done: !goal.done } : goal));

  const timeframes = ["daily", "weekly", "monthly", "yearly"];
  const categories = ["fitness", "career", "learning", "health", "finance", "spiritual"];

  const inputStyle = { background: `${t.primary}15`, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", color: t.text, fontSize: 14, fontWeight: 600, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>🎯 Goal System</h2>

      {/* Add Goal */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 14 }}>Set a New Goal</div>
        <input placeholder="What's your goal?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onKeyDown={e => e.key === "Enter" && addGoal()} style={{ ...inputStyle, marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <select value={form.timeframe} onChange={e => setForm(f => ({ ...f, timeframe: e.target.value }))} style={{ ...inputStyle, flex: 1 }}>
            {timeframes.map(tf => <option key={tf} value={tf}>{tf.charAt(0).toUpperCase() + tf.slice(1)}</option>)}
          </select>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, flex: 1 }}>
            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <button onClick={addGoal} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: t.primary, color: "white", fontWeight: 700, cursor: "pointer" }}>
          + Add Goal
        </button>
      </div>

      {/* Goals by Timeframe */}
      {timeframes.map(tf => {
        const tfGoals = goals.filter(g => g.timeframe === tf);
        if (!tfGoals.length) return null;
        const doneCount = tfGoals.filter(g => g.done).length;
        return (
          <div key={tf} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: t.text, textTransform: "capitalize" }}>
                {tf === "daily" ? "⚡ Daily" : tf === "weekly" ? "📅 Weekly" : tf === "monthly" ? "🗓️ Monthly" : "🏆 Yearly"} Goals
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.green }}>{doneCount}/{tfGoals.length}</div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <ProgressBar value={doneCount} max={tfGoals.length} color={t.green} height={6} />
            </div>
            {tfGoals.map(goal => (
              <div key={goal.id} onClick={() => toggleGoal(goal.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: `1px solid ${t.border}`, cursor: "pointer",
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: goal.done ? t.green : "transparent", border: `2px solid ${goal.done ? t.green : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", flexShrink: 0 }}>
                  {goal.done ? "✓" : ""}
                </div>
                <span style={{ flex: 1, fontSize: 14, color: goal.done ? t.textMuted : t.text, fontWeight: 600, textDecoration: goal.done ? "line-through" : "none" }}>{goal.title}</span>
                <Badge color={t.primary}>{goal.category}</Badge>
              </div>
            ))}
          </div>
        );
      })}

      {goals.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: t.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No goals set yet</div>
          <div style={{ fontSize: 13 }}>Add your first goal above</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ANALYTICS MODULE
// ============================================================

function Analytics({ t }) {
  const [habits] = useLocalStorage("habits", []);
  const [workoutLog] = useLocalStorage("workoutLog", []);
  const [mealLog] = useLocalStorage("mealLog", []);
  const [sleepLog] = useLocalStorage("sleepLog", []);
  const [codingLog] = useLocalStorage("codingLog", {});
  const [transactions] = useLocalStorage("transactions", []);

  const scores = [
    { label: "Fitness Score", value: Math.min(100, workoutLog.length * 5 + 30), color: t.green, icon: "💪" },
    { label: "Discipline Score", value: Math.min(100, habits.filter(h => (h.completedDates || []).length > 0).length * 10 + 20), color: t.primary, icon: "⚡" },
    { label: "Consistency Score", value: Math.min(100, Object.keys(codingLog).length * 3 + 30), color: t.cyan, icon: "🔥" },
    { label: "Nutrition Score", value: Math.min(100, mealLog.length * 2 + 20), color: t.gold, icon: "🥗" },
    { label: "Sleep Score", value: Math.min(100, sleepLog.length > 0 ? Math.round((sleepLog.slice(0, 7).reduce((s, e) => s + e.duration, 0) / Math.max(1, sleepLog.slice(0, 7).length)) * 12) : 40), color: "#8B5CF6", icon: "😴" },
    { label: "Finance Score", value: Math.min(100, transactions.length * 5 + 20), color: t.accent, icon: "💰" },
  ];

  const lifeScore = Math.round(scores.reduce((s, x) => s + x.value, 0) / scores.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text }}>📊 Life Analytics</h2>

      {/* Life Score */}
      <div style={{ background: `linear-gradient(135deg, ${t.primary}20, ${t.card})`, border: `1px solid ${t.primary}44`, borderRadius: 20, padding: 28, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <ScoreRing score={lifeScore} size={100} color={t.primary} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: t.text, marginBottom: 4 }}>Life Score</div>
          <div style={{ fontSize: 14, color: t.textSecondary }}>
            {lifeScore >= 80 ? "🏆 Exceptional — Keep it up!" : lifeScore >= 60 ? "📈 Good progress — Stay consistent" : "💪 Building momentum — Keep going"}
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Based on all life areas tracked</div>
        </div>
      </div>

      {/* Score Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {scores.map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, marginBottom: 10 }}>{s.label}</div>
            <ProgressBar value={s.value} color={s.color} height={6} />
          </div>
        ))}
      </div>

      {/* XP & Gamification */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 16 }}>🎮 XP & Level System</div>
        {(() => {
          const xp = workoutLog.length * 50 + habits.filter(h => h.completedDates?.length > 0).length * 30 + Object.keys(codingLog).length * 40;
          const level = Math.floor(xp / 500) + 1;
          const nextLevelXp = level * 500;
          const currentXp = xp % 500;
          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: t.gold }}>Level {level}</div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>{xp.toLocaleString()} total XP</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.textSecondary }}>{currentXp} / 500 XP</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>to Level {level + 1}</div>
                </div>
              </div>
              <ProgressBar value={currentXp} max={500} color={t.gold} height={10} />
            </div>
          );
        })()}
      </div>

      {/* Achievements */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 14 }}>🏆 Achievements</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { icon: "🔥", label: "First Workout", unlocked: workoutLog.length >= 1 },
            { icon: "💪", label: "10 Workouts", unlocked: workoutLog.length >= 10 },
            { icon: "🧘", label: "Habit Starter", unlocked: habits.some(h => h.completedDates?.length > 0) },
            { icon: "📚", label: "Code Logger", unlocked: Object.keys(codingLog).length >= 1 },
            { icon: "🌙", label: "Sleep Tracker", unlocked: sleepLog.length >= 1 },
            { icon: "💰", label: "Finance Tracker", unlocked: transactions.length >= 1 },
            { icon: "🕉️", label: "Seeker", unlocked: true },
            { icon: "⭐", label: "Early Adopter", unlocked: true },
          ].map(a => (
            <div key={a.label} style={{ padding: "8px 14px", borderRadius: 10, background: a.unlocked ? `${t.gold}22` : `${t.border}22`, border: `1px solid ${a.unlocked ? t.gold : t.border}`, opacity: a.unlocked ? 1 : 0.4, textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{a.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: a.unlocked ? t.gold : t.textMuted, marginTop: 4 }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function LifeOSApp() {
  const [isDark, setIsDark] = useLocalStorage("lifeos-theme", true);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useLocalStorage("lifeos-data", {
    waterIntake: 0, proteinIntake: 0, sleepHours: 0, studyHours: 0, steps: 0, calories: 0,
    disciplineScore: 72, consistencyScore: 68, fitnessScore: 75, careerScore: 65, knowledgeScore: 71,
    habits: HABITS.map(h => ({ ...h, completedDates: [] })),
  });

  const { t } = useStyles(isDark);

  const moduleComponents = {
    dashboard: <Dashboard t={t} data={data} setData={setData} />,
    fitness: <Fitness t={t} data={data} setData={setData} />,
    nutrition: <Nutrition t={t} data={data} setData={setData} />,
    sleep: <Sleep t={t} />,
    habits: <Habits t={t} data={data} setData={setData} />,
    aiml: <AIML t={t} />,
    coding: <Coding t={t} />,
    finance: <Finance t={t} />,
    journal: <Journal t={t} />,
    krishna: <Krishna t={t} />,
    goals: <Goals t={t} />,
    analytics: <Analytics t={t} />,
  };

  const globalStyles = `
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
    input[type=number]::-webkit-inner-spin-button { opacity: 0.5; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.3); border-radius: 999px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .module-enter { animation: fadeIn 0.3s ease; }
    select option { background: #1A1A26; color: #F0F0F8; }
    .sidebar-container { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 50; }
    @media (max-width: 768px) {
      .sidebar-container { position: fixed !important; left: 0; top: 0; bottom: 0; transform: translateX(-100%); }
      .sidebar-container.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.5); }
      .mobile-only { display: flex !important; }
      .desktop-only { display: none !important; }
    }
    @media (min-width: 769px) {
      .mobile-only { display: none !important; }
    }
  `;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, display: "flex", position: "relative" }}>
      <style>{globalStyles}</style>

      {/* Sidebar Overlay Mobile */}
      {sidebarOpen && (
        <div className="mobile-only" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, backdropFilter: "blur(2px)" }} />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`} style={{
        width: 240, flexShrink: 0, background: t.surface, borderRight: `1px solid ${t.border}`,
        display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0,
        overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 16px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${t.primary}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.03em", color: t.text }}>LifeOS AI</div>
              <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>LIFE OPERATING SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveModule(item.id); setSidebarOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2,
              background: activeModule === item.id ? `${t.primary}25` : "transparent",
              color: activeModule === item.id ? t.primary : t.textSecondary,
              fontWeight: activeModule === item.id ? 700 : 600, fontSize: 14,
              textAlign: "left", transition: "all 0.15s",
              borderLeft: activeModule === item.id ? `3px solid ${t.primary}` : "3px solid transparent",
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${t.border}` }}>
          <button onClick={() => setIsDark(!isDark)} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile Header */}
        <div className="mobile-only" style={{ alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: t.surface, borderBottom: `1px solid ${t.border}`, position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, padding: 0, color: t.text, display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${t.primary}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
              <span style={{ fontWeight: 900, fontSize: 18, color: t.text, letterSpacing: "-0.02em" }}>LifeOS AI</span>
            </div>
          </div>
          <button onClick={() => setIsDark(!isDark)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: 0 }}>
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Module Content */}
        <div className="module-enter" key={activeModule} style={{ flex: 1, padding: "24px 20px 40px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          {moduleComponents[activeModule]}
        </div>
      </div>
    </div>
  );
}
