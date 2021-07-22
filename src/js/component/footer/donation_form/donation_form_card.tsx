import * as React from 'react'

type DonationFormProps = {}

export const DonationFormCard: React.FC<DonationFormProps> = (_props) => {
    return (
        <div className="form-wrapper space-around column-direction">
            <div className="card-icon">
                <img className="icon" src="./images/ProfilePhoto.jpg" alt="Fumipo-Theta's icon" />
            </div>
            <div className="spread">
                <span className="important">Please donate</span> for maintenence and updating service ! <br />
                        We will not hold any personal information.
                </div>


            <form id="payment-form" className="spread inactive">
                <div className="space-around column-direction">

                    <div className="spread">
                        <select id="select-amount" defaultValue="placeholder">
                            <option value='placeholder' disabled style={{ display: 'none' }}>Select amount
                                </option>
                            <option value="small">100 JPY (1 USD)</option>
                            <option value="middle">1,000 JPY (10 USD)</option>
                            <option value="large">10,000 JPY (100 USD)</option>
                        </select>
                    </div>

                    <div className="spread">
                        <div id="card-element"></div>
                        <div id="card-errors" className="alert alert-warning" role="alert" style={{ display: 'none' }}>
                        </div>
                        <div id="card-success" className=" info-text inactive">
                            Payment was successful !
                            Thank you very much !
                            </div>
                    </div>

                    <div className="spread">
                        <button className="button rect-button">Donate <span id="show-amount"> </span></button>
                    </div>

                </div>
            </form>
        </div>
    )
}