import { supabase } from "./supabase";

// ─── AUTH ────────────────────────────────────────────────────────────────────
export async function signUp(email, password, fullName) {
  if (!supabase) throw new Error("Supabase nicht konfiguriert");
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } }
  });
  if (error) throw error;
  return data.user;
}

export async function signIn(email, password) {
  if (!supabase) throw new Error("Supabase nicht konfiguriert");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

export function onAuthChange(cb) {
  if (!supabase) return { data: { subscription: { unsubscribe(){} } } };
  return supabase.auth.onAuthStateChange((_event, session) => cb(session?.user || null));
}

// ─── ESTATE (formData + providers) ──────────────────────────────────────────
export async function loadEstate(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("estates")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) { console.error("loadEstate", error); return null; }
  return data;
}

export async function saveEstate(userId, estateId, formData, providers) {
  if (!supabase) return null;
  if (estateId) {
    const { data, error } = await supabase
      .from("estates")
      .update({ form_data: formData, providers })
      .eq("id", estateId)
      .select()
      .single();
    if (error) { console.error("saveEstate update", error); return null; }
    return data;
  }
  const { data, error } = await supabase
    .from("estates")
    .insert({ user_id: userId, form_data: formData, providers })
    .select()
    .single();
  if (error) { console.error("saveEstate insert", error); return null; }
  return data;
}

// ─── TASK STATUSES ───────────────────────────────────────────────────────────
export async function loadStatuses(estateId) {
  if (!supabase || !estateId) return [];
  const { data, error } = await supabase
    .from("task_statuses")
    .select("*")
    .eq("estate_id", estateId);
  if (error) { console.error("loadStatuses", error); return []; }
  return data || [];
}

export async function upsertStatus(userId, estateId, taskId, fields) {
  if (!supabase) return null;
  const row = { user_id: userId, estate_id: estateId, task_id: taskId, ...fields };
  const { data, error } = await supabase
    .from("task_statuses")
    .upsert(row, { onConflict: "estate_id,task_id" })
    .select()
    .single();
  if (error) { console.error("upsertStatus", error); return null; }
  return data;
}

export async function deleteStatus(estateId, taskId) {
  if (!supabase) return;
  const { error } = await supabase
    .from("task_statuses")
    .delete()
    .eq("estate_id", estateId)
    .eq("task_id", taskId);
  if (error) console.error("deleteStatus", error);
}

// ─── DOCUMENTS (Storage + Metadata) ─────────────────────────────────────────
export async function loadDocuments(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) { console.error("loadDocuments", error); return []; }
  return data || [];
}

export async function uploadDocument(userId, file) {
  if (!supabase) throw new Error("Supabase nicht konfiguriert");
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: file.type });
  if (upErr) throw upErr;
  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId, name: file.name, type: file.type,
      size: file.size, storage_path: path
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(doc) {
  if (!supabase) return;
  await supabase.storage.from("documents").remove([doc.storage_path]);
  await supabase.from("documents").delete().eq("id", doc.id);
}

export async function getDocumentUrl(storagePath) {
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60 * 60); // 1 hour
  if (error) { console.error("getDocumentUrl", error); return null; }
  return data?.signedUrl || null;
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────
export async function loadMessages(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", userId)
    .order("received_at", { ascending: false });
  if (error) { console.error("loadMessages", error); return []; }
  return data || [];
}

export async function insertMessage(userId, msg) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("messages")
    .insert({ user_id: userId, ...msg })
    .select()
    .single();
  if (error) { console.error("insertMessage", error); return null; }
  return data;
}

export async function markMessageRead(id) {
  if (!supabase) return;
  await supabase.from("messages").update({ read: true }).eq("id", id);
}

export async function deleteMessage(id) {
  if (!supabase) return;
  await supabase.from("messages").delete().eq("id", id);
}
