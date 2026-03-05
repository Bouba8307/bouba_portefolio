import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Project, ContentWork, Experience, Education, SkillGroup } from '../types';
import { PROJECTS, CONTENT_WORKS, EXPERIENCES, EDUCATION, SKILLS } from '../constants';
import { Section, Button } from './UI';
import { Plus, Trash2, Edit2, LogOut, Save, X, Database, AlertCircle } from 'lucide-react';

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'content'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [contentWorks, setContentWorks] = useState<ContentWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const pSnap = await getDocs(collection(db, 'projects'));
      setProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      
      const cSnap = await getDocs(collection(db, 'content_works'));
      setContentWorks(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as ContentWork)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!window.confirm('Voulez-vous importer TOUTES les données initiales (Projets, Créations, Expériences, Formations, Compétences) dans Firebase ?')) return;
    
    setLoading(true);
    try {
      const collections = [
        { name: 'projects', data: PROJECTS },
        { name: 'content_works', data: CONTENT_WORKS },
        { name: 'experiences', data: EXPERIENCES },
        { name: 'education', data: EDUCATION },
        { name: 'skills', data: SKILLS }
      ];

      for (const col of collections) {
        for (const item of col.data) {
          const { id, ...data } = item as any;
          await addDoc(collection(db, col.name), data);
        }
      }
      
      alert('Toutes les données fictives ont été enregistrées dans Firebase avec succès !');
      fetchAll();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de l\'importation globale');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: string, type: 'projects' | 'content_works') => {
    if (window.confirm('Supprimer cet élément ?')) {
      await deleteDoc(doc(db, type, id));
      fetchAll();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    
    // Handle stack as array
    if (data.stack) {
      data.stack = data.stack.split(',').map((s: string) => s.trim());
    }

    try {
      if (editingItem?.id) {
        await updateDoc(doc(db, activeTab === 'projects' ? 'projects' : 'content_works', editingItem.id), data);
      } else {
        await addDoc(collection(db, activeTab === 'projects' ? 'projects' : 'content_works'), data);
      }
      setEditingItem(null);
      fetchAll();
    } catch (e) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-medium">Dashboard Admin</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={seedDatabase} className="flex items-center gap-2 border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10">
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
              <h3 className="text-lg font-medium mb-1">Base de données vide détectée</h3>
              <p className="text-white/60 text-sm">Souhaitez-vous importer les données de démonstration pour commencer ?</p>
            </div>
            <Button onClick={seedDatabase} variant="secondary" className="text-xs py-2">
              Importer maintenant
            </Button>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all ${activeTab === 'projects' ? 'bg-brand-orange text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            PROJETS
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all ${activeTab === 'content' ? 'bg-brand-orange text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            CRÉATIONS
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display">{activeTab === 'projects' ? 'Liste des Projets' : 'Liste des Créations'}</h2>
              <Button onClick={() => setEditingItem({})} className="p-2 rounded-full">
                <Plus size={20} />
              </Button>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {(activeTab === 'projects' ? projects : contentWorks).map((item: any) => (
                  <div key={item.id} className="glass p-4 rounded-xl flex justify-between items-center group">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-white/40">{item.category}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingItem(item)} className="p-2 hover:text-brand-orange transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id, activeTab === 'projects' ? 'projects' : 'content_works')} className="p-2 hover:text-red-500 transition-colors">
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
                  <h2 className="text-xl font-display">{editingItem.id ? 'Modifier' : 'Ajouter'}</h2>
                  <button onClick={() => setEditingItem(null)} className="text-white/40 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-1">Titre</label>
                    <input name="title" defaultValue={editingItem.title} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-1">Catégorie</label>
                    <input name="category" defaultValue={editingItem.category} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-1">Image URL</label>
                    <input name="imageUrl" defaultValue={editingItem.imageUrl} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase mb-1">Description</label>
                    <textarea name="description" defaultValue={editingItem.description} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors h-24" />
                  </div>
                  
                  {activeTab === 'projects' && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">Stack (séparé par virgules)</label>
                        <input name="stack" defaultValue={editingItem.stack?.join(', ')} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">Problème</label>
                        <textarea name="problem" defaultValue={editingItem.problem} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/40 uppercase mb-1">Solution</label>
                        <textarea name="solution" defaultValue={editingItem.solution} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-brand-orange outline-none transition-colors" />
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full flex items-center justify-center gap-2">
                    <Save size={18} /> Enregistrer
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
