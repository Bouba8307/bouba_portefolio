import React, { useState, useEffect } from "react";
import {
  fetchAllRows,
  fetchLatestSettings,
  insertRow,
  updateRowDataMerge,
  deleteRow,
  rowExistsByJsonField,
  type JsonTable,
} from "../services/supabaseDb";
import { isSupabaseConfigured } from "../services/supabase";
import {
  Project,
  ContentWork,
  Experience,
  Education,
} from "../types";
import {
  PROJECTS,
  CONTENT_WORKS,
  EXPERIENCES,
  EDUCATION,
  SKILLS,
} from "../constants";
import { Section, Button, Toast } from "./UI";
import { getDirectImageUrl, normalizeStringArray } from "../utils";
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Save,
  X,
  Database,
  AlertCircle,
  Upload,
  Loader2,
  Link2,
  User,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { uploadPortfolioFile } from "../services/storage";
import { handleDatabaseError, OperationType } from "../services/errorHandling";

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<
    | "projects"
    | "content"
    | "messages"
    | "settings"
    | "experiences"
    | "education"
  >("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contentWorks, setContentWorks] = useState<ContentWork[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    name: "BT.",
    profileImageUrl: "",
    bio: "",
    faviconUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (settings.faviconUrl) {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = getDirectImageUrl(settings.faviconUrl);
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [settings.faviconUrl]);

  const fetchAll = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const pPath = "projects";
      try {
        const raw = await fetchAllRows<Project>("projects");
        setProjects(
          raw.map((p: any) => ({
            ...p,
            stack: normalizeStringArray(p?.stack),
          })),
        );
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, pPath);
      }

      const cPath = "content_works";
      try {
        setContentWorks(await fetchAllRows<ContentWork>("content_works"));
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, cPath);
      }

      const mPath = "messages";
      try {
        const raw = await fetchAllRows<{
          id: string;
          name: string;
          email: string;
          message: string;
          createdAt: string;
          read: boolean;
        }>("messages");
        setMessages(
          raw.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          ),
        );
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, mPath);
      }

      const sPath = "settings";
      try {
        const row = await fetchLatestSettings();
        if (row) setSettings(row);
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, sPath);
      }

      const getYear = (p: string) => {
        if (
          p.toLowerCase().includes("en cours") ||
          p.toLowerCase().includes("présent")
        )
          return 9999;
        const years = p.match(/\d{4}/g);
        return years ? Math.max(...years.map(Number)) : 0;
      };

      const expPath = "experiences";
      try {
        const data = await fetchAllRows<Experience>("experiences");
        data.sort((a, b) => getYear(b.period) - getYear(a.period));
        setExperiences(data);
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, expPath);
      }

      const eduPath = "education";
      try {
        const data = await fetchAllRows<Education>("education");
        data.sort((a, b) => getYear(b.period) - getYear(a.period));
        setEducation(data);
      } catch (error) {
        await handleDatabaseError(error, OperationType.GET, eduPath);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!isSupabaseConfigured) {
      showToast("Configurez Supabase dans .env", "error");
      return;
    }
    if (
      !window.confirm(
        "Voulez-vous importer TOUTES les données initiales (Projets, Créations, Expériences, Formations, Compétences) dans Supabase ?",
      )
    )
      return;

    setLoading(true);
    try {
      const collections: {
        name: JsonTable;
        data: readonly unknown[];
      }[] = [
        { name: "projects", data: PROJECTS },
        { name: "content_works", data: CONTENT_WORKS },
        { name: "experiences", data: EXPERIENCES },
        { name: "education", data: EDUCATION },
        { name: "skills", data: SKILLS },
      ];

      for (const col of collections) {
        for (const item of col.data) {
          const { id: _id, ...data } = item as Record<string, unknown> & {
            id?: string;
          };

          const valueToMatch =
            (data.title as string) ||
            (data.name as string) ||
            (data.institution as string);
          const matchField = data.title
            ? "title"
            : data.name
              ? "name"
              : "institution";

          if (valueToMatch && matchField) {
            try {
              const exists = await rowExistsByJsonField(
                col.name,
                matchField,
                String(valueToMatch),
              );
              if (exists) continue;
            } catch (error) {
              await handleDatabaseError(error, OperationType.GET, col.name);
            }
          }

          try {
            await insertRow(col.name, data as Record<string, unknown>);
          } catch (error) {
            await handleDatabaseError(error, OperationType.CREATE, col.name);
          }
        }
      }

      alert(
        "Toutes les données fictives ont été enregistrées dans Supabase avec succès !",
      );
      showToast("Données importées avec succès");
      fetchAll();
    } catch (e) {
      console.error(e);
      showToast("Erreur lors de l'importation", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm("Supprimer cet élément ?")) {
      try {
        await deleteRow(type as JsonTable, id);
        void fetchAll();
      } catch (error) {
        await handleDatabaseError(error, OperationType.DELETE, type);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadPortfolioFile(file);
      setImageUrl(publicUrl);
      setPreviewUrl(publicUrl);
      showToast("Image téléchargée avec succès");
    } catch (error: any) {
      console.error("Upload error:", error);
      showToast("Erreur lors du téléchargement: " + error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);
    try {
      const url = await uploadPortfolioFile(file);
      setSettings({ ...settings, profileImageUrl: url });
      showToast("Photo de profil mise à jour");
    } catch (e: any) {
      console.error("Profile upload error:", e);
      showToast("Erreur lors du téléchargement: " + e.message, "error");
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      const url = await uploadPortfolioFile(file);
      setSettings({ ...settings, faviconUrl: url });
      showToast("Favicon mis à jour");
    } catch (e: any) {
      console.error("Favicon upload error:", e);
      showToast("Erreur lors du téléchargement: " + e.message, "error");
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());

    // Handle stack, skills, technologies, methodologies as arrays
    if (data.stack)
      data.stack = data.stack.split(",").map((s: string) => s.trim());
    if (data.skills && typeof data.skills === "string")
      data.skills = data.skills.split(",").map((s: string) => s.trim());
    if (data.technologies && typeof data.technologies === "string")
      data.technologies = data.technologies
        .split(",")
        .map((s: string) => s.trim());
    if (data.methodologies && typeof data.methodologies === "string")
      data.methodologies = data.methodologies
        .split(",")
        .map((s: string) => s.trim());

    try {
      if (activeTab === "settings") {
        const path = "settings";
        try {
          if (settings.id) {
            await updateRowDataMerge(
              "settings",
              settings.id,
              data as Record<string, unknown>,
            );
          } else {
            await insertRow("settings", data as Record<string, unknown>);
          }
          showToast("Paramètres mis à jour !");
        } catch (error) {
          await handleDatabaseError(error, OperationType.WRITE, path);
        }
      } else if (editingItem?.id) {
        const path =
          activeTab === "projects"
            ? "projects"
            : activeTab === "content"
              ? "content_works"
              : activeTab === "experiences"
                ? "experiences"
                : "education";
        try {
          await updateRowDataMerge(
            path as JsonTable,
            editingItem.id,
            data as Record<string, unknown>,
          );
          showToast("Modifié avec succès !");
        } catch (error) {
          await handleDatabaseError(error, OperationType.UPDATE, path);
        }
      } else {
        const path =
          activeTab === "projects"
            ? "projects"
            : activeTab === "content"
              ? "content_works"
              : activeTab === "experiences"
                ? "experiences"
                : "education";
        try {
          await insertRow(path as JsonTable, data as Record<string, unknown>);
          showToast("Ajouté avec succès !");
        } catch (error) {
          await handleDatabaseError(error, OperationType.CREATE, path);
        }
      }

      if (activeTab !== "settings") setEditingItem(null);
      void fetchAll();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-medium">Dashboard Admin</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open("/", "_blank")}
              className="flex items-center gap-2 border-white/10 text-white/60 hover:bg-white/5"
            >
              <Globe size={18} /> Voir le site
            </Button>
            <Button
              variant="outline"
              onClick={seedDatabase}
              className="flex items-center gap-2 border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10"
            >
              <Database size={18} /> Migrer Données Fictives
            </Button>
            <Button onClick={onLogout} className="flex items-center gap-2">
              <LogOut size={18} /> Déconnexion
            </Button>
          </div>
        </div>

        {projects.length === 0 && contentWorks.length === 0 && !loading && (
          <div className="mb-8 p-6 glass border-brand-orange/30 flex items-center gap-6 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">
                Base de données vide détectée
              </h3>
              <p className="text-white/60 text-sm">
                Souhaitez-vous importer les données de démonstration pour
                commencer ?
              </p>
            </div>
            <Button
              onClick={seedDatabase}
              variant="secondary"
              className="text-xs py-2"
            >
              Importer maintenant
            </Button>
          </div>
        )}

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all whitespace-nowrap ${activeTab === "projects" ? "bg-brand-orange text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            PROJETS
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all whitespace-nowrap ${activeTab === "content" ? "bg-brand-orange text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            CRÉATIONS
          </button>
          <button
            onClick={() => setActiveTab("experiences")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all whitespace-nowrap ${activeTab === "experiences" ? "bg-brand-orange text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            EXPÉRIENCES
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all whitespace-nowrap ${activeTab === "education" ? "bg-brand-orange text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            FORMATIONS
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all whitespace-nowrap ${activeTab === "messages" ? "bg-brand-orange text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            MESSAGES{" "}
            {messages.filter((m) => !m.read).length > 0 && (
              <span className="ml-2 bg-white text-brand-orange px-2 py-0.5 rounded-full text-[10px]">
                {messages.filter((m) => !m.read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all whitespace-nowrap ${activeTab === "settings" ? "bg-brand-orange text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            PARAMÈTRES
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display">
                {activeTab === "projects"
                  ? "Liste des Projets"
                  : activeTab === "content"
                    ? "Liste des Créations"
                    : activeTab === "experiences"
                      ? "Liste des Expériences"
                      : activeTab === "education"
                        ? "Liste des Formations"
                        : "Messages Reçus"}
              </h2>
              {activeTab !== "messages" && (
                <Button
                  onClick={() => {
                    setEditingItem({});
                    setPreviewUrl("");
                  }}
                  className="p-2 rounded-full"
                >
                  <Plus size={20} />
                </Button>
              )}
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : activeTab === "settings" ? (
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-display mb-8">Mon Profil</h2>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                        Nom d'affichage
                      </label>
                      <input
                        name="name"
                        defaultValue={settings.name}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-brand-orange outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                        Photo de profil
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/5">
                          {settings.profileImageUrl ? (
                            <img
                              src={getDirectImageUrl(settings.profileImageUrl)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <User size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="profileImageUrl"
                              value={settings.profileImageUrl}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  profileImageUrl: e.target.value,
                                })
                              }
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-orange outline-none transition-colors"
                              placeholder="URL de l'image"
                            />
                            <label
                              className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors`}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfileUpload}
                                disabled={uploadingProfile}
                              />
                              {uploadingProfile ? (
                                <Loader2
                                  size={18}
                                  className="animate-spin text-brand-orange"
                                />
                              ) : (
                                <Upload size={18} />
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                      Favicon du site (.ico, .png)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                        {settings.faviconUrl ? (
                          <img
                            src={getDirectImageUrl(settings.faviconUrl)}
                            alt="Favicon"
                            className="w-8 h-8 object-contain"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="faviconUrl"
                            value={settings.faviconUrl}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                faviconUrl: e.target.value,
                              })
                            }
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="URL du favicon"
                          />
                          <label
                            className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors`}
                          >
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFaviconUpload}
                              disabled={uploadingFavicon}
                            />
                            {uploadingFavicon ? (
                              <Loader2
                                size={18}
                                className="animate-spin text-brand-orange"
                              />
                            ) : (
                              <Upload size={18} />
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-2">
                      Bio courte
                    </label>
                    <textarea
                      name="bio"
                      defaultValue={settings.bio}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-brand-orange outline-none transition-colors h-32"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12"
                  >
                    {loading ? "Enregistrement..." : "Mettre à jour le profil"}
                  </Button>
                </form>
              </div>
            ) : activeTab === "messages" ? (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-white/40 text-center py-12 glass rounded-2xl">
                    Aucun message reçu pour le moment.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`glass p-6 rounded-xl border ${msg.read ? "border-white/5" : "border-brand-orange/30"} transition-all`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{msg.name}</h3>
                          <p className="text-sm text-brand-orange">
                            {msg.email}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase font-mono mt-1">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!msg.read && (
                            <button
                              onClick={async () => {
                                const path = "messages";
                                try {
                                  await updateRowDataMerge(
                                    "messages",
                                    msg.id,
                                    { read: true },
                                  );
                                  void fetchAll();
                                } catch (error) {
                                  await handleDatabaseError(
                                    error,
                                    OperationType.UPDATE,
                                    path,
                                  );
                                }
                              }}
                              className="text-[10px] uppercase font-mono bg-brand-orange/20 text-brand-orange px-2 py-1 rounded hover:bg-brand-orange/30 transition-colors"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (window.confirm("Supprimer ce message ?")) {
                                const path = "messages";
                                try {
                                  await deleteRow("messages", msg.id);
                                  void fetchAll();
                                } catch (error) {
                                  await handleDatabaseError(
                                    error,
                                    OperationType.DELETE,
                                    path,
                                  );
                                }
                              }
                            }}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {(activeTab === "projects"
                  ? projects
                  : activeTab === "content"
                    ? contentWorks
                    : activeTab === "experiences"
                      ? experiences
                      : education
                ).map((item: any) => (
                  <div
                    key={item.id}
                    className="glass p-4 rounded-xl flex justify-between items-center group"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-white/40">
                        {item.category || item.company || item.institution}
                      </p>
                      <p className="text-[10px] text-brand-orange font-mono uppercase">
                        {item.period}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setImageUrl(item.imageUrl || "");
                          setPreviewUrl(item.imageUrl || "");
                        }}
                        className="p-2 hover:text-brand-orange transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            item.id,
                            activeTab === "projects"
                              ? "projects"
                              : activeTab === "content"
                                ? "content_works"
                                : activeTab === "experiences"
                                  ? "experiences"
                                  : "education",
                          )
                        }
                        className="p-2 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {editingItem && (
              <div className="glass p-6 rounded-2xl sticky top-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-display">
                    {editingItem.id ? "Modifier" : "Ajouter"}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setImageUrl("");
                      setPreviewUrl("");
                    }}
                    className="text-white/40 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                      Titre / Diplôme
                    </label>
                    <input
                      name="title"
                      defaultValue={editingItem.title}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                    />
                  </div>

                  {(activeTab === "projects" || activeTab === "content") && (
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                        Catégorie
                      </label>
                      <input
                        name="category"
                        defaultValue={editingItem.category}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                      />
                    </div>
                  )}

                  {activeTab === "experiences" && (
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                        Entreprise
                      </label>
                      <input
                        name="company"
                        defaultValue={editingItem.company}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                      />
                    </div>
                  )}

                  {activeTab === "education" && (
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                        Institution
                      </label>
                      <input
                        name="institution"
                        defaultValue={editingItem.institution}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                      />
                    </div>
                  )}

                  {(activeTab === "experiences" ||
                    activeTab === "education") && (
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                        Période (ex: 2024 - Présent)
                      </label>
                      <input
                        name="period"
                        defaultValue={editingItem.period}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                      />
                    </div>
                  )}

                  {(activeTab === "projects" || activeTab === "content") && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-mono text-white/40 uppercase">
                          Image (Firebase Storage)
                        </label>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <label
                          className={`flex-1 flex items-center justify-center gap-2 bg-white/5 border border-dashed border-white/20 rounded-lg px-4 py-3 transition-colors cursor-pointer hover:bg-white/10`}
                        >
                          {uploading ? (
                            <Loader2
                              size={18}
                              className="animate-spin text-brand-orange"
                            />
                          ) : (
                            <Upload size={18} className="text-white/40" />
                          )}
                          <span className="text-xs text-white/60">
                            {uploading
                              ? "Téléchargement..."
                              : "Choisir un fichier"}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <Link2 size={12} className="text-white/40" />
                        <label className="block text-xs font-mono text-white/40 uppercase">
                          Ou URL directe
                        </label>
                      </div>
                      <div className="space-y-3">
                        <input
                          name="imageUrl"
                          value={imageUrl}
                          required
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setPreviewUrl(e.target.value);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                        />
                        {(previewUrl || editingItem.imageUrl) && (
                          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5">
                            <img
                              src={getDirectImageUrl(
                                previewUrl || editingItem.imageUrl,
                              )}
                              className="w-full h-full object-cover"
                              alt="Preview"
                              onError={(e) => {
                                console.error(
                                  "Image load error for:",
                                  previewUrl || editingItem.imageUrl,
                                );
                                (e.target as HTMLImageElement).src =
                                  "https://picsum.photos/seed/error/1200/1600";
                              }}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingItem.description}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors h-24"
                    />
                  </div>

                  {activeTab === "education" && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                          Compétences (séparé par virgules)
                        </label>
                        <input
                          name="skills"
                          defaultValue={editingItem.skills?.join(", ")}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                          Technologies (séparé par virgules)
                        </label>
                        <input
                          name="technologies"
                          defaultValue={editingItem.technologies?.join(", ")}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                          Méthodologies (séparé par virgules)
                        </label>
                        <input
                          name="methodologies"
                          defaultValue={editingItem.methodologies?.join(", ")}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "projects" && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                          Stack (séparé par virgules)
                        </label>
                        <input
                          name="stack"
                        defaultValue={normalizeStringArray(editingItem.stack).join(", ")}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                            Lien du projet (Live)
                          </label>
                          <input
                            name="link"
                            defaultValue={editingItem.link}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                            Lien GitHub
                          </label>
                          <input
                            name="githubUrl"
                            defaultValue={editingItem.githubUrl}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                            Lien Figma
                          </label>
                          <input
                            name="figmaUrl"
                            defaultValue={editingItem.figmaUrl}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                            placeholder="https://figma.com/..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                          Problème
                        </label>
                        <textarea
                          name="problem"
                          defaultValue={editingItem.problem}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">
                          Solution
                        </label>
                        <textarea
                          name="solution"
                          defaultValue={editingItem.solution}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors"
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Enregistrer
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};
