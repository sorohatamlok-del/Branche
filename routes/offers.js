import express from "express";
import { createClient } from "@supabase/supabase-js";
import upload from "../upload.js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ⭐ رفع صورة العرض
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // إنشاء اسم فريد للصورة
    const fileName = `offer_${Date.now()}.${file.mimetype.split("/")[1]}`;

    // رفع الصورة إلى Supabase Storage
    const { error } = await supabase.storage
      .from("offers")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) return res.status(400).json({ error });

    // الحصول على رابط الصورة العام
    const { data: publicUrlData } = supabase.storage
      .from("offers")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    res.json({ url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// ⭐ إضافة عرض جديد
router.post("/", async (req, res) => {
  const { data, error } = await supabase
    .from("offers")
    .insert(req.body);

  if (error) return res.status(400).json({ error });
  res.json({ success: true, data });
});

// ⭐ جلب كل العروض
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// ⭐ جلب عرض واحد
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// ⭐ تحديث عرض
router.put("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("offers")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error });
  res.json({ success: true, data });
});

// ⭐ حذف عرض
router.delete("/:id", async (req, res) => {
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

export default router;
