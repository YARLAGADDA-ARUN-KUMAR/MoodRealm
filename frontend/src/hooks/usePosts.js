import api from '@/services/apiService';
import { useCallback, useEffect, useState } from 'react';

const usePosts = (baseUrl = '/posts', defaultSort = 'latest', defaultMood = 'All') => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortOption, setSortOption] = useState(defaultSort);
    const [mood, setMood] = useState(defaultMood);

    const fetchPosts = useCallback(
        async (moodFilter, pageNum, sortValue) => {
            try {
                setLoading(true);
                const moodParam = moodFilter === 'All' ? 'all' : moodFilter;

                const params = new URLSearchParams();
                params.append('page', pageNum);
                params.append('sort', sortValue);

                if (baseUrl === '/posts' && moodParam !== 'all') {
                    params.append('mood', moodParam);
                }

                if (baseUrl.includes('?')) {
                    // eslint-disable-next-line no-unused-vars
                    const [path, baseQuery] = baseUrl.split('?');
                    new URLSearchParams(baseQuery).forEach((value, key) => {
                        params.append(key, value);
                    });
                }

                const url = `${baseUrl.split('?')[0]}?${params.toString()}`;

                const { data } = await api.get(url);

                if (pageNum === 1) {
                    setPosts(data);
                } else {
                    setPosts((prev) => [...prev, ...data]);
                }

                if (sortValue === 'random') {
                    setHasMore(false);
                } else {
                    setHasMore(data.length === 10);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        },
        [baseUrl],
    );

    useEffect(() => {
        fetchPosts(mood, 1, sortOption);
        setPage(1);
    }, [mood, sortOption, fetchPosts]);

    const loadMore = () => {
        if (sortOption === 'random' || !hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(mood, nextPage, sortOption);
    };

    const refreshPosts = () => {
        fetchPosts(mood, 1, sortOption);
        setPage(1);
    };

    const shufflePosts = () => {
        fetchPosts(mood, 1, 'random');
        setPage(1);
    };

    return {
        posts,
        loading,
        page,
        hasMore,
        sortOption,
        mood,
        setSortOption,
        setMood,
        loadMore,
        refreshPosts,
        shufflePosts,
    };
};

export default usePosts;
