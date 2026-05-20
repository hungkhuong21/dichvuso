const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://dichvuso.onrender.com').replace(/\/+$/, '');

export type ApiService = {
  id: number;
  name: string;
  slug: string;
  department: string;
  image: string | null;
  imageUrl?: string;
  path: string;
  isActive: number;
  categories: { id: number; name: string; slug: string }[];
};

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message ?? `Lỗi ${res.status}`);
  }
  return res.json();
}

export const servicesApi = {
  list: () =>
    req<{ total: number; data: ApiService[] }>('/services'),

  create: (data: {
    name: string;
    department: string;
    image?: string;
    path: string;
    categoryIds: number[];
  }) => req<ApiService>('/services', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: {
    name?: string;
    department?: string;
    image?: string;
    path?: string;
    categoryIds?: number[];
    isActive?: boolean;
  }) => req<ApiService>(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remove: (id: number) =>
    req<{ success: boolean }>(`/services/${id}`, { method: 'DELETE' }),

  uploadImage: async (file: File): Promise<{ filename: string; imageUrl: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/upload/image`, { method: 'POST', body: form });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as any).message ?? `Lỗi upload ${res.status}`);
    }
    return res.json();
  },
};