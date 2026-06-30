import { create } from 'zustand';

// Define the Zustand store
const useStore = create((set, get) => ({
    user: null,
    page: 1,
    search: '',
    searchQuery: '',
    totalPages: 0,
    users: [],
    posts: [],
    comments: [],
    limit: 10,
    filterGenre: '',
    filterMedium: '',
    filterStatus: '',

    setUser: (user) => set(() => ({
        user: user
    })),

    setPosts: (posts) => set(() => ({
        posts: posts
    })),

    setComments: (comments) => set(() => ({
        comments: comments
    })),

    // Getting parent comment
    getComment: (parentId) => {
        const { comments } = get();
        return comments.filter((comment) => comment.id == parentId)[0];
    },

    // Get number of comments
    getCommentsNum: (postId) => {
        const { comments } = get();
        return comments.filter((comment) => comment.post_id == postId).length;
    },

    //Getting the formatted date
    getDate: (date) => {
        return new Date(date).toLocaleDateString();
    },

    addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),

    updatePost: (updatedPost) =>
        set((state) => ({
        posts: state.posts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
        ),
    })),

    removePost: (postId) =>
        set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
    })),

    addComment: (comment) =>
        set((state) => ({ comments: [...state.comments, comment] })),

    updateComment: (updatedComment) =>
        set((state) => ({
        comments: state.comments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
        ),
    })),
    
    removeComment: (commentId) =>
        set((state) => ({
        comments: state.comments.filter(
            (comment) => comment.id !== commentId
        ),
    })),

    // list genres
    getGenres: (post) => {
        return post.postgenres.map(postgenre => postgenre.genres.name).join(', ');
    },

    // list mediums
    getMediums: (post) => {
        return post.postmediums.map(postmedium => postmedium.mediums.name).join(', ');
    },

    // gets the most popular comment
    getMostPopularComment: (post) => {
        if (post.comments) {
            return post.comments
                .filter(comment => comment.parent_id == null)
                .sort((a, b) => b.commentlikes.length - a.commentlikes.length)[0];
        }
        return null;
    },

    setPage: (page) => set(() => ({
        page: page
    })),

    setSearch: (search) => set(() => ({
        search: search
    })),

    setSearchQuery: (query) => set(() => ({
        searchQuery: query
    })),

    setTotalPages: (totalPages) => set(() => ({
        totalPages: totalPages
    })),

    setLimit: (limit) => set(() => ({ limit })),

    setFilterGenre: (genre) => set(() => ({ filterGenre: genre })),

    setFilterMedium: (medium) => set(() => ({ filterMedium: medium })),

    setFilterStatus: (status) => set(() => ({ filterStatus: status })),

    // Notification state
    notifications: [],
    unreadCount: 0,

    setNotifications: (notifications) => set({ notifications }),

    setUnreadCount: (count) => set({ unreadCount: count }),

    addNotification: (notification) => set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    })),

    markNotificationRead: (id) => set((state) => {
      const updated = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    }),

    markAllNotificationsRead: () => set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }))
}));

export default useStore;