let formLogin;
let formLoginUsername;
let formLoginPassword;

let formCreateUser;
let formCreateUserName;
let formCreateUserLastName;
let formCreateUserEmail;
let formCreateUserUserName;
let formCreateUserPassword;

let btnDeleteUser;
let btnLogout;

const baseUrl = 'http://localhost:3000';

const init = () => {

    formLogin = document.querySelector('#form_login');
    formCreateUser = document.querySelector('#formCreateUser');
    btnDeleteUser = document.querySelector('#btnDeleteUser');
    btnLogout = document.querySelector('#btnLogout');

    if (formLogin) {
        formLogin.addEventListener('submit', submitLogin);
        formLoginUsername = document.querySelector('#username');
        formLoginPassword = document.querySelector('#password');
    }
    
    if (formCreateUser) {
        formCreateUser.addEventListener('submit', submitCreateUser);
        formCreateUserName = document.querySelector('#formCreateUserName');
        formCreateUserLastName = document.querySelector('#formCreateUserLastName');
        formCreateUserEmail = document.querySelector('#formCreateUserEmail');
        formCreateUserUserName = document.querySelector('#formCreateUserUserName');
        formCreateUserPassword = document.querySelector('#formCreateUserPassword');
    }

    if (btnDeleteUser) {
        btnDeleteUser.addEventListener('click', deleteUser)
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', logout)
    }
};

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);

const postFetch = ({route, body={}}) => {
    const url = `${baseUrl}/${route}`;
    const token = getToken();
    let headers = { 'Content-Type': 'application/json' };
    
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const method = 'POST';
    body = JSON.stringify(body);

    return fetch(url, { method, headers, body });
};

const deleteFetch = ({route, body={}}) => {
    const url = `${baseUrl}/${route}`;
    const token = getToken();
    let headers = { 'Content-Type': 'application/json' };
    
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const method = 'DELETE';
    body = JSON.stringify(body);

    return fetch(url, { method, headers, body });
};

const validLoginFields = (e) => {
    e.preventDefault();

    const error = (
        !(formLoginUsername.required) ||
        !(formLoginPassword.required)
    );

    formLoginUsername.required = true;
    formLoginPassword.required = true;
    formLoginUsername.type = 'text';
    formLoginPassword.type = 'password';

    if (error) throw new Error('Validación de campos incorrecta');
};

const validCreateFields = (e) => {
    e.preventDefault();

    const error = (
        !(formCreateUserName.required)     ||
        !(formCreateUserLastName.required) ||
        !(formCreateUserEmail.required)    ||
        !(formCreateUserUserName.required) ||
        !(formCreateUserPassword.required)
    );

    formCreateUserName.required = true;
    formCreateUserLastName.required = true;
    formCreateUserEmail.required = true;
    formCreateUserUserName.required = true;
    formCreateUserPassword.required = true;

    formCreateUserName.type = 'text';
    formCreateUserLastName.type = 'text';
    formCreateUserEmail.type = 'text';
    formCreateUserUserName.type = 'text';
    formCreateUserPassword.type = 'text';

    if (error) throw new Error('Validación de campos incorrecta');
};

const errorAlert = (text) => {
    const icon = 'error';
    return Swal.fire({ icon, text });
};

const successAlert = (text) => {
    const icon = 'success';
    return Swal.fire({ icon, text });
};

const questionAlert = (text) => {
    const icon = 'question';
    return Swal.fire({ icon, text, showDenyButton: true, denyButtonText: `Eliminar`, confirmButtonText: 'Cancelar' });
};

const submitLogin = async(e) => {
    try {
        validLoginFields(e);

        const route = 'login';
        const body = {
            username: formLoginUsername.value,
            password: formLoginPassword.value
        };

        const response = await postFetch({route, body});
        const data = await response.json();

        if (!data || data.status !== 200) throw new Error(data.msg);
        if (!data.token) throw new Error('Token invalido!');

        setToken(data.token);
        await successAlert(data.msg);
        
        window.location=`${baseUrl}/userList`;
    } catch (e) {
        console.log(e);
        errorAlert(e.toString());
    }
};

const submitCreateUser = async (e) => {
    try {
        validCreateFields(e);

        const route = 'createUser';
        const body = {
            name: formCreateUserName.value,
            lastName: formCreateUserLastName.value,
            email: formCreateUserEmail.value,
            userName: formCreateUserUserName.value,
            password: formCreateUserPassword.value
        };

        const response = await postFetch({route, body});
        const data = await response.json();

        if (!data || data.status !== 201) throw new Error(data.msg);

        await successAlert(data.msg);
        
        window.location=`${baseUrl}/userList`;
    } catch (e) {
        console.log(e);
        errorAlert(e.msg || e.toString());
    }
};

const deleteUser = async(button) => {
    const username = button.target.getAttribute("username");
    console.log('Target has: ', button.target);
    const msg = `¿Esta seguro de eliminar el usuario "${username}"?`;
    const confirmado = (await questionAlert(msg)).isConfirmed === false;

    if (confirmado) {
        const route = 'deleteUser';
        const body = { username };

        try {
            const response = await deleteFetch({ route, body });
            const data = await response.json();
    
            if (!data || data.status !== 200) throw new Error(data.msg);
    
            await successAlert(data.msg);
            
            window.location=`${baseUrl}/userList`;
        } catch (e) {
            console.log(e);
            errorAlert(e.msg || e.toString());
        }
    }
};

const logout = async () => {

    try {
        const route = 'logout';

        const response = await postFetch({route});
        const data = await response.json();

        if (!data || data.status !== 200) throw { status: 500, msg: 'Sesion no se pudo cerrar' }

        await successAlert(data.msg);

        window.location=`${baseUrl}/`;
    } catch(e) {
        console.log(e);
        errorAlert(e.msg || e.toString());
    }
};

document.addEventListener('DOMContentLoaded', init);