import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const { register } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/login');
        } else {
            // alert(result.message);
        }
    };

    return (
        <>
            <div className="container my-5 p-4 register-container">
                <div className="header-with-character">
                    <div className="character">
                        <img
                            src="https://icon-library.com/images/find-icon-png/find-icon-png-20.jpg"
                            alt="Register Character"
                            className="character-img"
                        />
                    </div>
                    <div className="speech-bubble">
                        <h1 className="text-center">
                            Register User
                        </h1>
                    </div>
                </div>
                <form onSubmit={submitHandler} className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="exampleInputName">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={onChangeHandler}
                            type="text"
                            className="form-control"
                            id="exampleInputName"
                            placeholder="Enter name"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={onChangeHandler}
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={onChangeHandler}
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                        />
                    </div>
                    <div className="d-grid col-6 mx-auto my-3">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
