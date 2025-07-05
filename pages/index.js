import Layout from '../components/Layout';

export default function Index() {
  return (
    <Layout>
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Our Platform</h1>
            <div className="hero-description">
              <p>
                Discover amazing content and explore our features.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}