import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// إضافة طلب
router.post("/", async (req, res) => {
  const { data, error } = await supabase
    .from("requests")
    .insert(req.body);

  if (error) return res.status(400).json({ error });
  res.json({ success: true, data });
});

// جلب كل الطلبات
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// جلب طلب واحد
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// تحديث طلب
router.put("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("requests")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error });
  res.json({ success: true, data });
});

// حذف طلب
router.delete("/:id", async (req, res) => {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

export default router;
