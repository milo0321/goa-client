export interface ResourceStore<T> {
    items: T[];
    currentItem: T | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    initialized: boolean; // 确保类型定义包含该字段
    fetchItems: (params?: any) => Promise<void>;
    getItem: (id: string) => Promise<void>;
    createItem: (data: any) => Promise<T>;
    updateItem: (id: string, data: any) => Promise<T>;
    deleteItem: (id: string) => Promise<void>;
    setCurrentItem: (item: T | null) => void;
    resetError: () => void;
}

// 基础分页参数
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string; // 具体实体在使用时指定
    sortOrder?: 'asc' | 'desc';
    
    force?: boolean; // 用于强制刷新
}

// 基础分页响应
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// 基础API响应
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// 带时间戳的实体基类
export interface BaseEntity {
    id: string;
    created_at: string; // ISO 8601格式
    updated_at: string;
}