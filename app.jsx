import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { websimAPI } from "./api.js";
import { leaderboard } from "./leaderboard.js";
const SORT_OPTIONS = [
  { key: "newest", label: "Newest First", icon: "\u{1F525}" },
  { key: "mostViewed", label: "Most Viewed", icon: "\u{1F441}\uFE0F" },
  { key: "mostLiked", label: "Most Liked", icon: "\u2764\uFE0F" },
  { key: "mostCommented", label: "Most Discussed", icon: "\u{1F4AC}" },
  { key: "score", label: "Top Rated", icon: "\u2B50" },
  { key: "alphabetical", label: "A-Z", icon: "\u{1F4DD}" }
];
function ProjectCard({ project, index }) {
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => setImageError(true);
  const formatNumber = (num) => {
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`;
    return num.toString();
  };
  const timeAgo = (date) => {
    const now = /* @__PURE__ */ new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 6e4);
    const hours = Math.floor(diff / 36e5);
    const days = Math.floor(diff / 864e5);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: `project-card glass-effect rounded-xl p-6 relative animate-fade-in ${project.isNew ? "new-indicator" : ""}`,
      style: { animationDelay: `${index * 100}ms` },
      children: [
        index < 3 && /* @__PURE__ */ jsxDEV("div", { className: "leaderboard-badge absolute -top-3 -left-3 z-10", children: [
          "#",
          index + 1
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 44,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: `https://images.websim.com/avatar/${project.creator.username}`,
              alt: project.creator.username,
              className: "w-12 h-12 rounded-full avatar-glow",
              onError: (e) => e.target.src = "https://via.placeholder.com/48/4F46E5/ffffff?text=" + project.creator.username.charAt(0).toUpperCase()
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 50,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold text-white mb-1 line-clamp-2", children: project.title }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 57,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-blue-300", children: [
              /* @__PURE__ */ jsxDEV("span", { children: [
                "@",
                project.creator.username
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 61,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-gray-400", children: "\u2022" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 62,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-sm", children: timeAgo(project.lastActivity) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 63,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 60,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 56,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 49,
          columnNumber: 13
        }, this),
        project.thumbnailUrl && !imageError && /* @__PURE__ */ jsxDEV("div", { className: "mb-4 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: project.thumbnailUrl,
            alt: project.title,
            className: "w-full h-48 object-cover transition-transform hover:scale-105",
            onError: handleImageError
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 70,
            columnNumber: 21
          },
          this
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 69,
          columnNumber: 17
        }, this),
        project.description && /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300 text-sm mb-4 line-clamp-3", children: project.description }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 80,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "stats-bar", children: /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "\u{1F441}\uFE0F" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 89,
                columnNumber: 29
              }, this),
              " ",
              formatNumber(project.views)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 88,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "\u2764\uFE0F" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 92,
                columnNumber: 29
              }, this),
              " ",
              formatNumber(project.likes)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 91,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "\u{1F4AC}" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 95,
                columnNumber: 29
              }, this),
              " ",
              formatNumber(project.comments)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 94,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 87,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-purple-300 font-semibold", children: [
            "Score: ",
            project.score
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 98,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 86,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 85,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 mt-3", children: [
          project.tags.map((tag) => /* @__PURE__ */ jsxDEV("span", { className: "metadata-chip", children: tag }, tag, false, {
            fileName: "<stdin>",
            lineNumber: 106,
            columnNumber: 21
          }, this)),
          /* @__PURE__ */ jsxDEV("span", { className: "metadata-chip", children: [
            "v",
            project.version
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 110,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 104,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: `https://websim.com/p/${project.id}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center transition-colors font-medium",
              children: "View Project"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 116,
              columnNumber: 17
            },
            this
          ),
          project.siteId && /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: `https://websim.com/c/${project.siteId}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-center transition-colors font-medium",
              children: "Try Live"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 125,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 115,
          columnNumber: 13
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 39,
      columnNumber: 9
    },
    this
  );
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxDEV("div", { className: "grid-container", children: [...Array(12)].map((_, i) => /* @__PURE__ */ jsxDEV("div", { className: "glass-effect rounded-xl p-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4 mb-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-full loading-skeleton" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 145,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "h-6 loading-skeleton rounded mb-2" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 147,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-4 loading-skeleton rounded w-32" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 148,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 146,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 144,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "h-48 loading-skeleton rounded mb-4" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 151,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "h-4 loading-skeleton rounded mb-2" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 152,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "h-4 loading-skeleton rounded w-3/4 mb-4" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 153,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "h-8 loading-skeleton rounded" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 154,
      columnNumber: 21
    }, this)
  ] }, i, true, {
    fileName: "<stdin>",
    lineNumber: 143,
    columnNumber: 17
  }, this)) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 141,
    columnNumber: 9
  }, this);
}
function StatsPanel({ stats, isLoading, discoveryStats }) {
  if (isLoading) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "glass-effect rounded-xl p-6 mb-8 animate-slide-up mobile-spacing", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold mb-4 text-center mobile-text-xl", children: "\u{1F4CA} Leaderboard Stats" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 166,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 mobile-stats-grid", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-blue-400 mobile-text-xl", children: stats.totalProjects }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 169,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-300", children: "Total Projects" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 170,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 168,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-green-400 mobile-text-xl", children: stats.newProjects }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 173,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-300", children: "New Today" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 174,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 172,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-purple-400 mobile-text-xl", children: [
          (stats.totalViews / 1e3).toFixed(1),
          "k"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 177,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-300", children: "Total Views" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 180,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 176,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-red-400 mobile-text-xl", children: stats.totalLikes }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 183,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-300", children: "Total Likes" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 184,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 182,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 167,
      columnNumber: 13
    }, this),
    discoveryStats && discoveryStats.isDiscovering && /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 rounded-lg p-3 text-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 192,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-medium text-green-400", children: "Continuously discovering new projects..." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 193,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 191,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-400", children: [
        "Found ",
        discoveryStats.totalSessionDiscovered,
        " new projects this session"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 195,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 190,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 165,
    columnNumber: 9
  }, this);
}
function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);
  const [discoveryActive, setDiscoveryActive] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) => project.title.toLowerCase().includes(query) || project.creator.username.toLowerCase().includes(query) || project.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [projects, searchQuery]);
  const stats = useMemo(() => leaderboard.getStats(), [projects]);
  useEffect(() => {
    initializeApp();
    return () => {
      leaderboard.stopContinuousDiscovery();
    };
  }, []);
  useEffect(() => {
    if (projects.length > 0) {
      const sorted = leaderboard.getSortedProjects(sortBy, null, filters);
      setProjects(sorted);
    }
  }, [sortBy, filters]);
  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);
      await loadInitialProjects();
      if (discoveryActive) {
        leaderboard.startContinuousDiscovery(websimAPI);
      }
      const refreshInterval = setInterval(() => {
        const sortedProjects = leaderboard.getSortedProjects(sortBy, null, filters);
        setProjects(sortedProjects);
        setLastRefresh(/* @__PURE__ */ new Date());
      }, 3e4);
      return () => clearInterval(refreshInterval);
    } catch (err) {
      setError(err.message);
      console.error("Failed to initialize app:", err);
    }
  };
  const loadInitialProjects = async () => {
    try {
      const response = await websimAPI.getRecentProjects(50);
      if (response.feed && response.feed.data) {
        const projectsMetadata = response.feed.data.map((item) => websimAPI.extractProjectMetadata(item)).filter((project) => project.title && project.creator);
        leaderboard.indexProjects(projectsMetadata);
        const sortedProjects = leaderboard.getSortedProjects(sortBy);
        setProjects(sortedProjects);
        setLastRefresh(/* @__PURE__ */ new Date());
        console.log(`Initial load: ${sortedProjects.length} projects`);
      }
    } catch (err) {
      console.warn("Failed to load initial projects:", err);
    } finally {
      setLoading(false);
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.style.opacity = "0";
        setTimeout(() => loadingScreen.remove(), 500);
      }
    }
  };
  const handleRefresh = () => {
    websimAPI.clearCache();
    const sortedProjects = leaderboard.getSortedProjects(sortBy, null, filters);
    setProjects(sortedProjects);
    setLastRefresh(/* @__PURE__ */ new Date());
  };
  const toggleDiscovery = () => {
    if (discoveryActive) {
      leaderboard.stopContinuousDiscovery();
    } else {
      leaderboard.startContinuousDiscovery(websimAPI);
    }
    setDiscoveryActive(!discoveryActive);
  };
  if (error) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-6xl mb-4", children: "\u26A0\uFE0F" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 324,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold mb-2", children: "Failed to Load Projects" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 325,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400 mb-4", children: error }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 326,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleRefresh,
          className: "bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors",
          children: "Try Again"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 327,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 323,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 322,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "sticky top-0 glass-effect z-40 border-b border-gray-700", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto px-4 py-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent", children: "\u{1F680} Websim New" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 345,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "hidden md:flex items-center gap-4", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: toggleDiscovery,
              className: `px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${discoveryActive ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: `w-2 h-2 rounded-full ${discoveryActive ? "bg-white animate-pulse" : "bg-gray-400"}` }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 359,
                  columnNumber: 33
                }, this),
                discoveryActive ? "Discovery On" : "Discovery Off"
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 351,
              columnNumber: 29
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleRefresh,
              disabled: loading,
              className: "bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ jsxDEV("span", { className: loading ? "animate-spin" : "", children: "\u{1F504}" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 369,
                  columnNumber: 33
                }, this),
                "Refresh"
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 364,
              columnNumber: 29
            },
            this
          ),
          lastRefresh && /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-400", children: [
            "Updated: ",
            lastRefresh.toLocaleTimeString()
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 373,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 350,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "md:hidden", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setShowMobileNav(!showMobileNav),
            className: "p-2 rounded-md bg-gray-800 hover:bg-gray-700",
            "aria-label": "Toggle navigation",
            children: /* @__PURE__ */ jsxDEV("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: showMobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 387,
              columnNumber: 37
            }, this) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 386,
              columnNumber: 33
            }, this)
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 381,
            columnNumber: 29
          },
          this
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 380,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 344,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "hidden md:flex mt-4 gap-4 items-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            placeholder: "Search projects, creators, or descriptions...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 396,
            columnNumber: 30
          },
          this
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 395,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: SORT_OPTIONS.map((option) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSortBy(option.key),
            className: `sort-button px-3 py-2 rounded-lg transition-all font-medium text-sm flex items-center ${sortBy === option.key ? "active text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`,
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "mr-2", children: option.icon }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 415,
                columnNumber: 37
              }, this),
              option.label
            ]
          },
          option.key,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 406,
            columnNumber: 33
          },
          this
        )) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 404,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 394,
        columnNumber: 21
      }, this),
      showMobileNav && /* @__PURE__ */ jsxDEV("div", { className: "md:hidden mt-4 animate-fade-in space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            placeholder: "Search...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-base"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 426,
            columnNumber: 33
          },
          this
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 425,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: SORT_OPTIONS.map((option) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setSortBy(option.key);
              setShowMobileNav(false);
            },
            className: `sort-button p-2 rounded-lg transition-all font-medium text-xs flex flex-col items-center justify-center h-16 ${sortBy === option.key ? "active text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`,
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-lg", children: option.icon }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 448,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "mt-1 truncate", children: option.label.split(" ")[0] }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 449,
                columnNumber: 41
              }, this)
            ]
          },
          option.key,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 436,
            columnNumber: 37
          },
          this
        )) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 434,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: toggleDiscovery,
              className: `flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${discoveryActive ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}`,
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: `w-2 h-2 rounded-full ${discoveryActive ? "bg-white animate-pulse" : "bg-gray-400"}` }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 462,
                  columnNumber: 37
                }, this),
                discoveryActive ? "Discovery On" : "Discovery Off"
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 454,
              columnNumber: 33
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleRefresh,
              disabled: loading,
              className: "flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxDEV("span", { className: loading ? "animate-spin" : "", children: "\u{1F504}" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 472,
                  columnNumber: 37
                }, this),
                "Refresh"
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 467,
              columnNumber: 33
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 453,
          columnNumber: 29
        }, this),
        lastRefresh && /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-400 text-center", children: [
          "Last updated: ",
          lastRefresh.toLocaleTimeString()
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 477,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 424,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 342,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 341,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "max-w-7xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxDEV(StatsPanel, { stats, isLoading: loading, discoveryStats: stats.discovery }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 487,
        columnNumber: 17
      }, this),
      loading ? /* @__PURE__ */ jsxDEV(LoadingSkeleton, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 490,
        columnNumber: 21
      }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV("div", { className: "mb-6 text-center mobile-spacing-sm", children: /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold text-gray-300 mobile-text-lg", children: [
          filteredProjects.length,
          " projects found",
          searchQuery && ` for "${searchQuery}"`
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 494,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 493,
          columnNumber: 25
        }, this),
        filteredProjects.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-16 mobile-spacing", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-6xl mb-4", children: "\u{1F50D}" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 502,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold mb-2 mobile-text-xl", children: "No projects found" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 503,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400", children: "Try adjusting your search or filters" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 504,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 501,
          columnNumber: 29
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid-container", children: filteredProjects.map((project, index) => /* @__PURE__ */ jsxDEV(
          ProjectCard,
          {
            project,
            index
          },
          project.id,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 509,
            columnNumber: 37
          },
          this
        )) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 507,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 492,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 486,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 339,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 526,
  columnNumber: 13
}));
