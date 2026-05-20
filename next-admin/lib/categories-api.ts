const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://dichvuso.onrender.com').replace(/\/+$/, '');

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  serviceCount: number;
};

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories`);
  if (!res.ok) throw new Error(`Lỗi ${res.status}`);
  return res.json();
}

// thêm danh mục dịch vụ mới
export async function createCategory(name: string): Promise<Category> {
  const res = await fetch(`${BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Lỗi ${res.status}`);
  return res.json();
}

//sửa danh mục dịch vụ
export async function updateCategory(id: number, name?: string, description?: string): Promise<Category> {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) throw new Error(`Lỗi ${res.status}`);
  return res.json();
}

//xoá danh mục dịch vụ
export async function deleteCategory(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message ?? `Lỗi ${res.status}`);
  }
  return res.json();
}
