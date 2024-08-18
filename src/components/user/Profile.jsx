import React, { useContext } from 'react'
import AppContext from '../../context/AppContext'
import ShowOrderProduct from '../ShowOrderProduct';

const Profile = () => {
    const { user, userOrder } = useContext(AppContext);
    return (
        <div className="container text-center my-5 profile-container">
            <h1>Welcome, {user?.name}</h1>
            <div className="welcome-message">
                <p>
                    We are thrilled to have you at Ajmera Paints! On behalf of Mr. Kamal Ajmera and the entire team, we welcome you to our store.
                    Explore our website and discover a wide range of high-quality paints and painting supplies at unbeatable prices.
                    Whether you're planning a DIY project or looking for professional-grade products, we have something for everyone.
                </p>
                <p>
                    Feel free to reach out to us at <strong>9837140458</strong> for any inquiries or assistance.
                    We pride ourselves on offering exceptional customer service and support.
                    Explore our products, find what you need, and share your experience with others.
                    We are here to help make your painting projects a success!
                </p>
            </div>

            <div className="container text-center my-3">

                <h3>{user?.email}</h3>
                <h1>Total Order :- {userOrder?.length}</h1>
            </div>

            <div className="container my-5">
                <table className="table table-bordered border-primary bg-dark">
                    <thead className="bg-dark">
                        <tr>
                            <th scope="col" className="bg-dark text-light text-center">
                                OrderItems
                            </th>
                            <th scope="col" className="bg-dark text-light text-center">
                                OrderDetails & ShippingAddress
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-dark">
                        {userOrder && (
                            <>
                                {userOrder.map((product) => (
                                    <tr key={product._id}>
                                        <td className="bg-dark text-light">
                                            <ShowOrderProduct items={product.orderItems} />
                                        </td>
                                        <td className="bg-dark text-light">
                                            <ul style={{ fontWeight: "bold" }}>
                                                <li>OrderId: {product?.orderId}</li>
                                                <li>PaymentId: {product?.paymentId}</li>
                                                <li>PaymentStatus: {product?.payStatus}</li>
                                                <li>Name: {product?.userShipping?.fullName}</li>
                                                <li>Phone: {product?.userShipping?.phoneNumber}</li>
                                                <li>Country: {product?.userShipping?.country}</li>
                                                <li>State: {product?.userShipping?.state}</li>
                                                <li>PinCode: {product?.userShipping?.pincode}</li>
                                                <li>Near By: {product?.userShipping?.address}</li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Profile;
