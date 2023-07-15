import axios from '../utils/axios-customize';

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}

export const callFetchListUser = (query) => {
    return axios.get(`/api/v1/user?${query}`)
}

export const callCreateUser = (fullName, password, email, phone) => {
    return axios.post(`/api/v1/user`, { fullName, password, email, phone });
}

export const callCreateListUsers = (data) => {
    return axios.post('/api/v1/user/bulk-create', data)
}

export const callUpdateUser = (_id, fullName, phone) => {
    return axios.put('/api/v1/user', { _id, fullName, phone })
}

export const callDeleteUser = (_id) => {
    return axios.delete(`/api/v1/user/${_id}`)
}

// books

export const callGetListBook = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const callGetBookCategory = () => {
    return axios.get('/api/v1/database/category');
}

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

export const callCreateBook = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.post('/api/v1/book', {
        thumbnail,
        slider,
        mainText,
        author,
        price,
        sold,
        quantity,
        category
    })
}

export const callUpdateBook = (id, mainText, thumbnail, slider, author, price, quantity, category, sold) => {
    return axios.put(`api/v1/book/${id}`, { mainText, thumbnail, slider, author, price, quantity, category, sold })
}

export const callDeleteBook = (id) => {
    return axios.delete(`api/v1/book/${id}`)
}

export const callFecthDetailBookById = (id) => {
    return axios.get(`api/v1/book/${id}`)
}

export const callCreateOrder = (name, address, phone, totalPrice, detail) => {
    return axios.post(`api/v1/order`, { name, address, phone, totalPrice, detail })
}

export const callGetHistoryOrder = () => {
    return axios.get(`/api/v1/history`)
}

export const callUpdateAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Upload-type': 'avatar'
        }
    })
}

export const callUpdateUserInfo = (_id, fullName, phone, avatar) => {
    return axios.put(`api/v1/user`, { _id, fullName, phone, avatar })
}

export const callChangPassword = (email, oldpass, newpass) => {
    return axios.post('api/v1/user/change-password', { email, oldpass, newpass })
}