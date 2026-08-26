import "../styles/Home.css"

function Home() {



    return (
        <div>
            <ul className ="navbar">
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard/">Dashboard</a></li>
                <li className = "navbar-logout-li">
                    <a href="/logout/">Logout</a>
                </li>
            </ul>   

            <h1>Product Manager</h1>
            <h2>Welcome to the Product Manager !</h2>
            <h3>This is test application</h3>
            <h4>You can create, edit, and delete products.</h4>
            <h4>All products will be saved in the database.</h4>
            <h4>The products can be seen in the dashboard</h4>
        </div>
    );
}

export default Home;