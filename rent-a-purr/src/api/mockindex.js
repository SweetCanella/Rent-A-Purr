// export const API_BASE_URL = 'https://vj6ftrfp-8000.euw.devtunnels.ms';
export const API_BASE_URL = 'http://localhost:8000';

export const getImageUrl = (fileData) => {
    if (!fileData) return 'https://via.placeholder.com/600x400?text=Нет+фото';
    const filename = Array.isArray(fileData) ? fileData[0] : fileData;
    if (!filename || typeof filename !== 'string') return 'https://via.placeholder.com/600x400?text=Ошибка+формата';

    // Если это моковая картинка из интернета или локальный Blob (загруженный файл)
    if (filename.startsWith('http') || filename.startsWith('blob')) return filename;

    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
    return `${API_BASE_URL}/${cleanFilename}`;
};

// ============================================================================
// МОКОВЫЙ БЭКЕНД (ДЛЯ ТЕСТОВ)
// ============================================================================

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let mockUsers =[
    { id: 1, username: 'admin', password: '123', nickname: 'Главный Админ', email: 'admin@mail.ru', phone: '+79990000000', access_level: 1 },
    { id: 2, username: 'user', password: '123', nickname: 'Обычный Юзер', email: 'user@mail.ru', phone: '+79991112233', access_level: 0 }
];

let mockCats =[
    {
        id: 1, name: "Барсик", description: "Крупный, пушистый и очень ласковый кот.", breed: "Мейн-кун", age: "2 года",
        filenames:["https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800"],
        tags:["Крупный", "Ласковый", "Любит спать"],
        bookings: [[1, "2026-03-15 10:00:00", "2026-03-15 18:00:00"]],
        medical:[
            { id: 1, icon: "syringe", label: "Привит", color: "#FFFFFF", bg: "#FF2B4A" },
            { id: 2, icon: "heartPulse", label: "Здоров", color: "#FFFFFF", bg: "#00D26A" }
        ]
    },
    {
        id: 2, name: "Снежок", description: "Активный и очень любознательный малыш.", breed: "Турецкая ангора", age: "1 год",
        filenames:["https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800"],
        tags:["Энергичный", "Любопытный", "К лотку приучен"],
        bookings: [],
        medical:[{ id: 3, icon: "syringe", label: "Привит", color: "#FFFFFF", bg: "#FF2B4A" }]
    }
];

let mockBookings =[
    {
        id: 1, cat_id: 1, cat_name: "Барсик", user_id: 2, nickname: "Обычный Юзер",
        email: "user@mail.ru", phone: "+79991112233", start_time: "2026-03-15 10:00:00",
        end_time: "2026-03-15 18:00:00", status: 1,
        filenames:["https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800"]
    }
];

let currentUser = null;

export const api = {
    register: async (data) => {
        await delay(500);
        if (!data.username || !data.password || !data.nickname) throw new Error("Bad Json");
        if (mockUsers.find(u => u.username === data.username)) throw new Error("User already exists");

        const newUser = { id: Date.now(), ...data, email: data.username + '@mail.com', access_level: 0 };
        mockUsers.push(newUser);
        currentUser = newUser;
        return { status: "ok", message: "User created", user: { nickname: newUser.nickname, user_id: newUser.id, phone: newUser.phone, access_level: newUser.access_level } };
    },

    login: async (data) => {
        await delay(500);
        const user = mockUsers.find(u => u.username === data.username && u.password === data.password);
        if (!user) throw new Error("Wrong username or password");
        currentUser = user;
        return { status: "ok", message: "User authorized", user: { nickname: user.nickname, user_id: user.id, phone: user.phone, access_level: user.access_level } };
    },

    logout: async () => {
        await delay(300);
        currentUser = null;
        return { status: "ok" };
    },

    getProfile: async () => {
        await delay(500);
        if (!currentUser) throw new Error("Unauthorized");
        const userBookings = mockBookings.filter(b => b.user_id === currentUser.id);
        return {
            status: "ok",
            user: {
                user_id: currentUser.id,
                nickname: currentUser.nickname,
                email: currentUser.email,
                phone: currentUser.phone,
                access_level: currentUser.access_level,
                bookings: userBookings
            }
        };
    },

    getCats: async () => {
        await delay(500);
        return { status: "ok", cats: [...mockCats] };
    },

    addCat: async (formData) => {
        await delay(800);
        if (!currentUser || currentUser.access_level !== 1) throw new Error("Unauthorized");

        const files = formData.getAll('photos');
        const fileUrls = files.length > 0
            ? files.map(f => URL.createObjectURL(f))
            :["https://via.placeholder.com/600x400?text=Нет+фото"];

        const newCat = {
            id: Date.now(),
            name: formData.get('name'),
            description: formData.get('description'),
            breed: formData.get('breed'),
            age: formData.get('age'),
            filenames: fileUrls,
            tags: formData.get('tags') ? formData.get('tags').split(',') : [],
            bookings:[],
            medical:[]
        };

        const medicalRaw = formData.get('medical');
        if (medicalRaw) {
            const parts = medicalRaw.split(',');
            for(let i=0; i < parts.length; i+=4) {
                newCat.medical.push({ id: Date.now()+i, icon: parts[i], label: parts[i+1], color: parts[i+2], bg: parts[i+3] });
            }
        }

        mockCats.push(newCat);
        return { status: "ok", ...newCat };
    },

    updateCat: async (id, data) => {
        await delay(500);
        if (!currentUser || currentUser.access_level !== 1) throw new Error("Unauthorized");
        const cat = mockCats.find(c => c.id === id);
        if (!cat) throw new Error("Cat not found");

        if (data.tags) cat.tags = data.tags.split(',');
        if (data.medical) {
            const parts = data.medical.split(',');
            const newMed =[];
            for(let i=0; i < parts.length; i+=4) {
                newMed.push({ id: Date.now()+i, icon: parts[i], label: parts[i+1], color: parts[i+2], bg: parts[i+3] });
            }
            cat.medical = newMed;
        }
        return { status: "ok" };
    },

    addBooking: async (data) => {
        await delay(500);
        if (!currentUser) throw new Error("Unauthorized");
        const cat = mockCats.find(c => c.id === data.id);
        if (!cat) throw new Error("Cat not found");

        const newBooking = {
            id: Date.now(), cat_id: data.id, cat_name: cat.name,
            user_id: currentUser.id, nickname: currentUser.nickname,
            email: currentUser.email, phone: currentUser.phone,
            start_time: data.start, end_time: data.end, status: 0,
            filenames: cat.filenames
        };
        mockBookings.push(newBooking);
        cat.bookings.push([newBooking.id, data.start, data.end]);
        return { status: "ok", message: "Booking created successfully" };
    },

    getAdminBookings: async () => {
        await delay(500);
        if (!currentUser || currentUser.access_level !== 1) throw new Error("Unauthorized");
        return { status: "ok", bookings: mockBookings };
    },

    addAdminBooking: async (data) => {
        await delay(500);
        if (!currentUser || currentUser.access_level !== 1) throw new Error("Unauthorized");
        const cat = mockCats.find(c => c.id === data.cat_id);
        const newBooking = {
            id: Date.now(), cat_id: data.cat_id, cat_name: cat?.name,
            user_id: 999, nickname: "Добавлено Админом", email: data.email, phone: "Неизвестен",
            start_time: data.start_time, end_time: data.end_time, status: 1,
            filenames: cat?.filenames
        };
        mockBookings.push(newBooking);
        if(cat) cat.bookings.push([newBooking.id, data.start_time, data.end_time]);
        return { status: "ok" };
    },

    confirmAdminBooking: async (data) => {
        await delay(500);
        if (!currentUser || currentUser.access_level !== 1) throw new Error("Unauthorized");
        const b = mockBookings.find(x => x.id === data.booking_id);
        if(b) b.status = 1;
        return { status: "ok" };
    },

    deleteAdminBooking: async (data) => {
        await delay(500);
        if (!currentUser || currentUser.access_level !== 1) throw new Error("Unauthorized");
        mockBookings = mockBookings.filter(x => x.id !== data.booking_id);
        mockCats.forEach(c => { c.bookings = c.bookings.filter(bk => bk[0] !== data.booking_id) });
        return { status: "ok" };
    }
};

// ============================================================================
// РЕАЛЬНЫЙ БЭКЕНД (ЗАКОММЕНТИРОВАНО ДЛЯ ТЕСТОВ)
// ============================================================================

/*
async function fetchAPI(endpoint, options = {}) {
    const config = {
        ...options,
        credentials: 'include',
    };

    if (options.body && !(options.body instanceof FormData)) {
        config.headers = {
            'Content-Type': 'application/json',
            ...config.headers,
        };

        if (typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok || data.status === 'bad') {
            throw new Error(data.message || data.error || 'Произошла ошибка на сервере');
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Нет связи с сервером. Проверьте подключение.');
        }
        throw error;
    }
}

export const api = {
    register: (data) => fetchAPI('/register', { method: 'POST', body: data }),
    login: (data) => fetchAPI('/login', { method: 'POST', body: data }),
    logout: () => fetchAPI('/logout', { method: 'POST' }),
    getProfile: () => fetchAPI('/profile', { method: 'GET' }),
    getCats: () => fetchAPI('/cats', { method: 'GET' }),
    addCat: (formData) => fetchAPI('/cats', { method: 'POST', body: formData }),
    updateCat: (id, data) => fetchAPI(`/cats/${id}`, { method: 'PUT', body: data }),
    addBooking: (data) => fetchAPI('/bookings', { method: 'POST', body: data }),
    getAdminBookings: () => fetchAPI('/bookings/admin', { method: 'GET' }),
    addAdminBooking: (data) => fetchAPI('/bookings/admin', { method: 'POST', body: data }),
    confirmAdminBooking: (data) => fetchAPI('/bookings/admin', { method: 'PUT', body: data }),
    deleteAdminBooking: (data) => fetchAPI('/bookings/admin', { method: 'DELETE', body: data }),
};
*/