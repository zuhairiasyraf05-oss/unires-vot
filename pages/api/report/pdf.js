import { supabase } from '../../../lib/supabase';
import { verifyToken } from '../../../lib/auth';
import { generateReportHtml } from '../../../lib/reportHtml';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Expected body: { votId }
  const { votId } = req.body;
  if (!votId) {
    return res.status(400).json({ error: 'Missing votId' });
  }

  // Gather data for the report
  const [{ data: vot, error: votErr }] = await Promise.all([
    supabase.from('vots').select('*').eq('id', votId).single(),
  ]);
  if (votErr) {
    return res.status(500).json({ error: votErr.message });
  }

  const { data: expenses, error: expErr } = await supabase
    .from('expenses')
    .select('*')
    .eq('vot_id', votId)
    .order('month');
  if (expErr) {
    return res.status(500).json({ error: expErr.message });
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const html = generateReportHtml({
    vot,
    expenses,
    total,
  });

  let browser = null;
  try {
    const executablePath = await chromium.executablePath;
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report_${votId}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'PDF generation failed' });
  } finally {
    if (browser) await browser.close();
  }
}
