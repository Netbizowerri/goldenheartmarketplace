import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Container } from "./ui/Container";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/src/lib/firebase";

interface Lead {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  country: string;
  submittedAt?: {
    _seconds?: number;
  };
}

async function readResponseMessage(response: Response) {
  const payload = await response.json().catch(() => null);
  return payload?.error || "We could not complete that request.";
}

export const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [tableError, setTableError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        void fetchLeads(currentUser);
      } else {
        setLeads([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchLeads = async (currentUser: User) => {
    setLoading(true);
    setTableError("");
    try {
      const token = await currentUser.getIdToken(true);
      const response = await fetch("/api/admin/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const message = await readResponseMessage(response);

        if (response.status === 401 || response.status === 403) {
          await signOut(auth);
          setAuthError(message);
          setLeads([]);
          return;
        }

        setTableError(message);
        setLeads([]);
        return;
      }

      const data = (await response.json()) as Lead[];
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setTableError("We could not load merchant leads. Please try again.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError("Enter your admin email address.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setAuthError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setAuthError("Enter your password.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setAuthError("Your password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
    } catch {
      setAuthError("We could not sign you in with those credentials.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setLeads([]);
    setTableError("");
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-soft-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-black flex items-center justify-center p-6 bg-line-pattern">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full"
        >
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">🔐</div>
          <h1 className="text-2xl font-black text-center mb-2">Admin Portal</h1>
          <p className="text-medium-grey text-center mb-8 text-sm">Sign in with your admin credentials.</p>
          
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <label className="text-xs font-bold uppercase text-medium-grey mb-1 block">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@goldenheart.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-medium-grey mb-1 block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                autoComplete="current-password"
              />
            </div>
            {authError && <p className="text-red-500 text-xs font-bold">{authError}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-soft-black text-white py-4 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-black">Merchant Leads</h1>
            <p className="text-medium-grey">Review and manage incoming vendor applications.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => void fetchLeads(user)}
              className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gold border-t-transparent animate-spin" />
              <p className="text-medium-grey font-bold">Loading merchant leads...</p>
            </div>
          ) : tableError ? (
            <div className="p-12 text-center">
              <p className="text-red-600 font-bold">{tableError}</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-medium-grey font-bold">No leads found yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black uppercase text-medium-grey">Date</th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-medium-grey">Merchant</th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-medium-grey">Business</th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-medium-grey">Category</th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-medium-grey">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{lead.submittedAt?._seconds ? new Date(lead.submittedAt._seconds * 1000).toLocaleDateString() : "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-soft-black">{lead.fullName}</p>
                        <p className="text-xs text-medium-grey">{lead.country}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{lead.businessName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-tighter">
                          {lead.businessType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{lead.email}</p>
                        <p className="text-xs text-medium-grey">{lead.phone}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
