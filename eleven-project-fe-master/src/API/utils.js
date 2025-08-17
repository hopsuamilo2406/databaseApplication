export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://eleven-project.onrender.com/api';
export const ACCESS_TOKEN = 'accessToken';
export const EMAIL = 'email';
export const USERNAME = 'username';
export const USER_ID = 'user_id';
export const USER_ROLE = 'user_role';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('x-access-token', localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};


export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return Promise.resolve({
        email: localStorage.getItem(EMAIL),
        username: localStorage.getItem(USERNAME)
    });
}

export function getAllProducts(minPrice, maxPrice, sortBy, sortOrder) {
    let url = API_BASE_URL + "/products?page=0&size=100";

    if (minPrice) {
        url += "&minPrice=" + minPrice;
    }

    if (maxPrice) {
        url += "&maxPrice=" + maxPrice;
    }

    if (sortBy) {
        url += "&sortBy=" + sortBy;
    }

    if (sortOrder) {
        url += "&sortOrder=" + sortOrder;
    }

    return request({
        url: url,
        method: 'GET',
    });
}
export function getAllProductsByCategory(categoryId) {
    return request({
        url: API_BASE_URL + "/products/category/" + categoryId+"?page=0&size=100",
        method: 'GET',
    });

}

export function getAllCategories() {
    return request({
        url: API_BASE_URL + "/categories",
        method: 'GET',
    });
}

export function getCart() {
    return request({
        url: API_BASE_URL + "/carts",
        method: 'GET'
    });
}

export function addToCart(productId, productTitle, price) {
    return request({
        url: API_BASE_URL + "/carts/add",
        method: 'POST',
        body: JSON.stringify({
            userId: localStorage.getItem(USER_ID),
            productId: productId,
            productTitle: productTitle,
            productQuantity: 1,
            price: price
        }),
    });
}

export function checkOutCart() {
    return request({
        url: API_BASE_URL + "/orders",
        method: 'POST',
        body: JSON.stringify({
            userId: localStorage.getItem(USER_ID)
        }),
    });
}

export function getOrder() {
    return request({
        url: API_BASE_URL + "/orders/" + localStorage.getItem(USER_ID),
        method: 'GET'
    });
}

export function updateStatusOrder(orderId, status ) {
    return request({
        url: API_BASE_URL + "/orders/status/" + localStorage.getItem(USER_ID),
        method: 'PUT',
        body: JSON.stringify({
            orderId: orderId,
            status: status
        }),
    });
}