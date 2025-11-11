import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Post, PostStatus, PostTag } from '@/interfaces/Post';
import axios from 'axios';

const API_BASE = `${API_ROOT}/api/posts`;

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<ResponseInterface<Post[]>>(`${API_BASE}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data.success) {
      const posts: Post[] = response.data.data;
      return posts;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error fetching posts in getAllPosts:', err);
    return [];
  }
};

export const getAllAvailablePosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<ResponseInterface<Post[]>>(
      `${API_BASE}/available`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const posts: Post[] = response.data.data;
      return posts;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error fetching posts in getAllPosts:', err);
    return [];
  }
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const allPosts = await getAllPosts();
    if (allPosts.length === 0) {
      return [];
    }
    const userPosts: Post[] = allPosts.filter(
      (p: Post) => p.customerId === userId,
    );
    return userPosts;
  } catch (err) {
    console.log('Error fetching user posts in getUserPosts:', err);
    return [];
  }
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  if (!postId) return null;
  try {
    const response = await axios.get<ResponseInterface<Post>>(
      `${API_BASE}/${postId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const currentPost = response.data.data;
      return currentPost;
    } else {
      throw new Error('Post not found');
    }
  } catch (err) {
    console.error('Error fetching post data:', err);
    return null;
  }
};

export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  try {
    const response = await axios.get<ResponseInterface<Post[]>>(
      `${API_BASE}/user/${userId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const posts: Post[] = response.data.data;
      return posts;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error fetching posts by user ID in getPostsByUserId:', err);
    return [];
  }
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const response = await axios.get<ResponseInterface<Post[]>>(
      `${API_BASE}/search?query=${query}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const posts: Post[] = response.data.data;
      return posts;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error searching posts in searchPosts:', err);
    return [];
  }
};

export interface FilterPostParams {
  userId?: string;
  title?: string;
  tags: PostTag[];
  other: string;
  minBudget?: number;
  maxBudget?: number;
  startDate?: string;
  endDate?: string;
}

export const filterPosts = async (
  params: FilterPostParams,
): Promise<Post[]> => {
  try {
    const response = await axios.get<ResponseInterface<Post[]>>(
      `${API_BASE}/filter`,
      {
        headers: { 'Content-Type': 'application/json' },
        params: params,
      },
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error filtering posts in filterPosts:', err);
    return [];
  }
};

export interface PostFormInterface {
  title: string;
  description: string;
  tag: PostTag | null;
  other: string;
  telNumber: string;
  budget: number;
  location: string;
  coverPhotoUrl?: string;
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
  date: Date | undefined;
}

export const createPost = async (
  userId: string,
  formData: PostFormInterface,
): Promise<boolean> => {
  try {
    const payload = {
      ...formData,
      customerId: userId,
      date: formData.date ? formData.date.toISOString() : undefined,
    };

    const response = await axios.post<ResponseInterface<Post>>(
      `${API_BASE}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return !!response.data.success;
  } catch (err) {
    console.error('Error creating post:', err);
    return false;
  }
};

export const updatePostStatus = async (postId: string, status: PostStatus) => {
  try {
    const response = await axios.put<ResponseInterface<Post>>(
      `${API_BASE}/${postId}`,
      { status },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    if (response.data.success) {
      return true;
    } else {
      throw new Error('Failed to update post');
    }
  } catch (err) {
    console.error('Error updating post:', err);
    return false;
  }
};

export const updatePost = async (
  postId: string,
  formData: PostFormInterface,
): Promise<boolean> => {
  try {
    const payload = {
      ...formData,
      date: formData.date ? formData.date.toISOString() : undefined,
    };

    const response = await axios.put<ResponseInterface<Post>>(
      `${API_BASE}/${postId}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return !!response.data.success;
  } catch (err) {
    console.error('Error updating post:', err);
    return false;
  }
};
