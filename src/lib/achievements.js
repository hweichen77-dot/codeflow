
export function computeAchievements({ progress = [], projects = [], streak = 0, capstones = [] } = {}) {
  const completed = progress.filter((p) => p.completed);
  const completedLessons = completed.length;

  const totalLessons = projects.reduce((s, p) => s + (p.lessons_count || 0), 0);
  const pct = totalLessons ? (completedLessons / totalLessons) * 100 : 0;

  const fullyCompleteProjects = projects.filter((proj) => {
    if (!proj.lessons_count) return false;
    const done = completed.filter((p) => p.project_id === proj.id).length;
    return done >= proj.lessons_count;
  }).length;

  const defs = [
    {
      id: "first_lesson",
      title: "First Steps",
      desc: "Complete your first lesson.",
      icon: "",
      unlocked: completedLessons >= 1,
    },
    {
      id: "first_module",
      title: "Module Master",
      desc: "Finish an entire module.",
      icon: "",
      unlocked: fullyCompleteProjects >= 1,
    },
    {
      id: "streak_3",
      title: "Warming Up",
      desc: "Reach a 3-day streak.",
      icon: "",
      unlocked: streak >= 3,
    },
    {
      id: "streak_7",
      title: "On Fire",
      desc: "Reach a 7-day streak.",
      icon: "",
      unlocked: streak >= 7,
    },
    {
      id: "streak_30",
      title: "Unstoppable",
      desc: "Reach a 30-day streak.",
      icon: "",
      unlocked: streak >= 30,
    },
    {
      id: "first_capstone",
      title: "Shipped It",
      desc: "Submit your first capstone.",
      icon: "",
      unlocked: (capstones?.length || 0) >= 1,
    },
    {
      id: "half_track",
      title: "Halfway Hero",
      desc: "Complete 50% of all lessons.",
      icon: "",
      unlocked: pct >= 50,
    },
    {
      id: "full_track",
      title: "Track Conqueror",
      desc: "Complete 100% of the track.",
      icon: "",
      unlocked: totalLessons > 0 && pct >= 100,
    },
  ];

  return defs;
}

export default computeAchievements;
