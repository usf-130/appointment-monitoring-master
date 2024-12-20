import { Card, Placeholder, Spinner } from "react-bootstrap";

const ContentLoading = () => {
  return (
    <div className="wrapper">
      <div className="header-title-p"></div>
      <div className="main">
        <nav className="navbar navbar-expand navbar-theme mx-2">
          <div className="menu"></div>
        </nav>
        <div className="content">
          <div className="container-fluid ">
            <div className="header text-left">
              <h1 className="header-title"></h1>
              <p className="header-subtitle"></p>
            </div>
            <div className="row">
              <div className=" d-flex">
                <div className="w-100">
                  <div className="row">
                    {[1, 2, 3, 4].map((_,index) => (
                      
                        <div className="col-6 col-lg-3 px-2 mb-3" key={index}>
                          <div
                            className="card shadow border-0 card-counter mt-4"
                            style={{ height: "150px" }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div className="col mt-0">
                                  <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6} bg="secondary" />
                                  </Placeholder>
                                </div>
                              </div>
                              <div className="display-5 mt-1">
                                <Placeholder as={Card.Text} animation="glow">
                                  <Placeholder xs={5} bg="secondary" />
                                </Placeholder>
                              </div>
                            </div>
                          </div>
                        </div>
                      
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "30vh",
              }}
            >
              <Spinner
              variant="primary"
                animation="grow"
                style={{ width: "150px", height: "150px" }}
              />
            </div>
          </div>
        </div>

        <footer className="footer mt-5">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 text-center pt-4">
                <p className="text-white fs-6">
                  کلیه حقوق مادی و معنوی برای استانداری کردستان محفوظ است
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ContentLoading;
