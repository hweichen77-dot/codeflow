import React, { useState, useEffect } from "react";
import { api } from "@/api/apiClient";

function ItemList({ items, statuses, running, onRunOne, labelKey = "title", subKey = null }) {
  return (
    <div style={{ border: "1px solid #262219" }}>
      <div className="px-5 py-3" style={{ borderBottom: "1px solid #262219", background: "#131009" }}>
        <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#BBB3A4" }}>
          {items.length} items
        </span>
      </div>
      {items.map((item, i) => {
        const status = statuses[item.id];
        return (
          <div
            key={item.id}
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #1C1A14" }}
          >
            <div className="flex items-center gap-4">
              <span className="font-sans text-xs w-6 text-right flex-shrink-0" style={{ color: "#ECE7DC" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-display text-sm font-medium" style={{ color: "#D8D1C2" }}>
                  {item[labelKey]}
                </div>
                {subKey && item[subKey] && (
                  <div className="font-sans text-xs" style={{ color: "#BBB3A4" }}>{item[subKey]}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {status === "running" && (
                <span className="font-sans text-xs animate-pulse" style={{ color: "#C2643C" }}> running...</span>
              )}
              {status === "done" && (
                <span className="font-sans text-xs" style={{ color: "#E8A33C" }}>✓ done</span>
              )}
              {status === "error" && (
                <span className="font-sans text-xs" style={{ color: "#FF6B5C" }}>✗ error</span>
              )}
              {status === "already_expanded" && (
                <span className="font-sans text-xs" style={{ color: "#BBB3A4" }}>✓ already expanded</span>
              )}
              {!running && (
                <button
                  onClick={() => onRunOne(item)}
                  disabled={status === "running"}
                  className="font-sans text-xs tracking-widest uppercase px-3 py-1.5 transition-all"
                  style={{ color: "#C9C1B2", border: "1px solid #262219", background: "transparent", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#E8A33C"; e.currentTarget.style.borderColor = "#E8A33C33"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#C9C1B2"; e.currentTarget.style.borderColor = "#262219"; }}
                >
                  {status === "already_expanded" ? "Re-expand" : "Expand"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LessonExpander() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("lessons");

  const [enrichStatuses, setEnrichStatuses] = useState({});
  const [enrichRunning, setEnrichRunning] = useState(false);
  const [enrichIndex, setEnrichIndex] = useState(-1);

  const [lessons, setLessons] = useState([]);
  const [lessonStatuses, setLessonStatuses] = useState({});
  const [lessonRunning, setLessonRunning] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(-1);

  const [projects, setProjects] = useState([]);
  const [projectStatuses, setProjectStatuses] = useState({});
  const [projectRunning, setProjectRunning] = useState(false);
  const [projectIndex, setProjectIndex] = useState(-1);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.auth.me().then(u => {
      setUser(u);
      if (u?.role === "admin") {
        Promise.all([
          api.entities.Lesson.list("order"),
          api.entities.Project.list("order"),
        ]).then(([ls, ps]) => {
          setLessons(ls);
          setProjects(ps);
          const initLessonStatuses = {};
          ls.forEach(l => { if (l.explanation) initLessonStatuses[l.id] = "already_expanded"; });
          setLessonStatuses(initLessonStatuses);
          const initProjectStatuses = {};
          ps.forEach(p => { if (p.description && p.description.length > 100) initProjectStatuses[p.id] = "already_expanded"; });
          setProjectStatuses(initProjectStatuses);
          setLoaded(true);
        });
      }
    }).catch(() => {});
  }, []);

  const runAllLessons = async () => {
    setLessonRunning(true);
    const toRun = lessons.filter(l => lessonStatuses[l.id] !== "already_expanded" && lessonStatuses[l.id] !== "done");
    for (let i = 0; i < toRun.length; i++) {
      const lesson = toRun[i];
      setLessonIndex(i);
      setLessonStatuses(prev => ({ ...prev, [lesson.id]: "running" }));
      try {
        await api.functions.invoke("expandSingleLesson", { lessonId: lesson.id });
        setLessonStatuses(prev => ({ ...prev, [lesson.id]: "done" }));
      } catch (e) {
        setLessonStatuses(prev => ({ ...prev, [lesson.id]: "error" }));
      }
    }
    setLessonIndex(-1);
    setLessonRunning(false);
  };

  const runOneLesson = async (lesson) => {
    setLessonStatuses(prev => ({ ...prev, [lesson.id]: "running" }));
    try {
      await api.functions.invoke("expandSingleLesson", { lessonId: lesson.id });
      setLessonStatuses(prev => ({ ...prev, [lesson.id]: "done" }));
    } catch (e) {
      setLessonStatuses(prev => ({ ...prev, [lesson.id]: "error" }));
    }
  };

  const runAllProjects = async () => {
    setProjectRunning(true);
    const toRun = projects.filter(p => projectStatuses[p.id] !== "already_expanded" && projectStatuses[p.id] !== "done");
    for (let i = 0; i < toRun.length; i++) {
      const project = toRun[i];
      setProjectIndex(i);
      setProjectStatuses(prev => ({ ...prev, [project.id]: "running" }));
      try {
        await api.functions.invoke("expandSingleProject", { projectId: project.id });
        setProjectStatuses(prev => ({ ...prev, [project.id]: "done" }));
      } catch (e) {
        setProjectStatuses(prev => ({ ...prev, [project.id]: "error" }));
      }
    }
    setProjectIndex(-1);
    setProjectRunning(false);
  };

  const runOneProject = async (project) => {
    setProjectStatuses(prev => ({ ...prev, [project.id]: "running" }));
    try {
      await api.functions.invoke("expandSingleProject", { projectId: project.id });
      setProjectStatuses(prev => ({ ...prev, [project.id]: "done" }));
    } catch (e) {
      setProjectStatuses(prev => ({ ...prev, [project.id]: "error" }));
    }
  };

  const runAllEnrich = async () => {
    setEnrichRunning(true);
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      setEnrichIndex(i);
      setEnrichStatuses(prev => ({ ...prev, [lesson.id]: "running" }));
      try {
        await api.functions.invoke("enrichLesson", { lessonId: lesson.id });
        setEnrichStatuses(prev => ({ ...prev, [lesson.id]: "done" }));
      } catch (e) {
        setEnrichStatuses(prev => ({ ...prev, [lesson.id]: "error" }));
      }
    }
    setEnrichIndex(-1);
    setEnrichRunning(false);
  };

  const runOneEnrich = async (lesson) => {
    setEnrichStatuses(prev => ({ ...prev, [lesson.id]: "running" }));
    try {
      await api.functions.invoke("enrichLesson", { lessonId: lesson.id });
      setEnrichStatuses(prev => ({ ...prev, [lesson.id]: "done" }));
    } catch (e) {
      setEnrichStatuses(prev => ({ ...prev, [lesson.id]: "error" }));
    }
  };

  const lessonDone = Object.values(lessonStatuses).filter(s => s === "done").length;
  const lessonErrors = Object.values(lessonStatuses).filter(s => s === "error").length;
  const projectDone = Object.values(projectStatuses).filter(s => s === "done").length;
  const projectErrors = Object.values(projectStatuses).filter(s => s === "error").length;

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#15130E" }}>
        <p className="font-sans text-sm" style={{ color: "#C9C1B2" }}>Admin access required.</p>
      </div>
    );
  }

  const isLessonsTab = tab === "lessons";
  const running = isLessonsTab ? lessonRunning : projectRunning;
  const currentIndex = isLessonsTab ? lessonIndex : projectIndex;
  const totalCount = isLessonsTab ? lessons.length : projects.length;

  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-16" style={{ background: "#15130E" }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#E8A33C" }}>
            ADMIN TOOL
          </span>
          <h1 className="font-display font-bold text-3xl mt-2 mb-1" style={{ color: "#F2EDE2" }}>
            AI Content Expander
          </h1>
          <p className="font-display text-sm" style={{ color: "#C9C1B2" }}>
            Uses Claude Sonnet to enrich lessons with detailed explanations, quizzes & activities — and rewrites project descriptions to be crystal clear for AI beginners.
          </p>
        </div>

        <div className="flex gap-0 mb-6" style={{ borderBottom: "1px solid #262219" }}>
          {["lessons", "projects", "enrich"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all"
              style={{
                color: tab === t ? "#E8A33C" : "#BBB3A4",
                borderBottom: tab === t ? "2px solid #E8A33C" : "2px solid transparent",
                background: "transparent",
                marginBottom: "-1px",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "enrich" && loaded && (
          <div>
            <div className="flex items-center gap-4 mb-6 p-5" style={{ border: "1px solid #262219", background: "#131009" }}>
              <button
                onClick={runAllEnrich}
                disabled={enrichRunning}
                className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all"
                style={{
                  background: enrichRunning ? "#262219" : "#cc66ff",
                  color: enrichRunning ? "#BBB3A4" : "#15130E",
                  border: "1px solid transparent", fontWeight: 700,
                  cursor: enrichRunning ? "not-allowed" : "pointer",
                }}
              >
                {enrichRunning ? ` Enriching ${enrichIndex + 1}/${lessons.length}...` : ` Enrich All Lessons (${lessons.length})`}
              </button>
              <div className="font-sans text-xs" style={{ color: "#C9C1B2" }}>
                Adds key terms, callouts, diagrams, inline quizzes, quizzes & participation activities
              </div>
            </div>
            <ItemList
              items={lessons}
              statuses={enrichStatuses}
              running={enrichRunning}
              onRunOne={runOneEnrich}
              labelKey="title"
              subKey="concept"
            />
          </div>
        )}

        {tab !== "enrich" && (
        <div className="flex items-center gap-4 mb-6 p-5" style={{ border: "1px solid #262219", background: "#131009" }}>
          <button
            onClick={isLessonsTab ? runAllLessons : runAllProjects}
            disabled={running || !loaded}
            className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all"
            style={{
              background: running ? "#262219" : "#E8A33C",
              color: running ? "#BBB3A4" : "#15130E",
              border: "1px solid transparent",
              fontWeight: 700,
              cursor: running ? "not-allowed" : "pointer",
            }}
          >
            {running
              ? ` Processing ${currentIndex + 1}/${(isLessonsTab ? lessons : projects).filter(x => lessonStatuses[x.id] !== "already_expanded" && lessonStatuses[x.id] !== "done").length}...`
              : ` Expand All ${isLessonsTab ? "Lessons" : "Projects"} (${(isLessonsTab ? lessons : projects).filter(x => (isLessonsTab ? lessonStatuses : projectStatuses)[x.id] !== "already_expanded" && (isLessonsTab ? lessonStatuses : projectStatuses)[x.id] !== "done").length} remaining)`}
          </button>

          {isLessonsTab && Object.keys(lessonStatuses).length > 0 && (
            <div className="font-sans text-xs" style={{ color: "#C9C1B2" }}>
              <span style={{ color: "#E8A33C" }}>{lessonDone} done</span>
              {lessonErrors > 0 && <span style={{ color: "#FF6B5C", marginLeft: "12px" }}>{lessonErrors} errors</span>}
              {" / "}{lessons.length} total
            </div>
          )}
          {!isLessonsTab && Object.keys(projectStatuses).length > 0 && (
            <div className="font-sans text-xs" style={{ color: "#C9C1B2" }}>
              <span style={{ color: "#E8A33C" }}>{projectDone} done</span>
              {projectErrors > 0 && <span style={{ color: "#FF6B5C", marginLeft: "12px" }}>{projectErrors} errors</span>}
              {" / "}{projects.length} total
            </div>
          )}
        </div>

        )}

        {tab !== "enrich" && loaded && isLessonsTab && (
          <ItemList
            items={lessons}
            statuses={lessonStatuses}
            running={lessonRunning}
            onRunOne={runOneLesson}
            labelKey="title"
            subKey="concept"
          />
        )}
        {tab !== "enrich" && loaded && !isLessonsTab && (
          <ItemList
            items={projects}
            statuses={projectStatuses}
            running={projectRunning}
            onRunOne={runOneProject}
            labelKey="title"
            subKey="category"
          />
        )}
      </div>
    </div>
  );
}