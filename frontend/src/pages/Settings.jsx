import React, {Component} from 'react';
import client from '../_utils/Client';

class Settings extends Component{
    constructor(props){
        super(props);
        this.state = {
            settings: {
                showNickName: false,
                enableNotifications: false,
                enableSounds: false,
                darkMode: false
            }
        }
    }

    componentDidMount(){
        client.get(`${process.env.REACT_APP_API_URL}/users/settings`, this.state)
        .then(res => {
            this.setState({
                settings: res.data,
                settingsLoaded: true
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    onChange(e){
        let {checked, name} = e.target;
        this.setState({
            [name]: checked,
            settings: {
                ...this.state.settings,
                [name]: checked
            }
        }, () => {
            client.patch(`${process.env.REACT_APP_API_URL}/users/settings`, {[name]: this.state[name]})
            .then(res => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
        });        
    }

    render(){
        
        const { settings } = this.state;
        
        return(
            <>
                <h2 className="font-bold mb-6">الاعدادات</h2>

                <div className="card card-active-listener">
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item pt-0 px-0">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    
                                    <h6 className="mb-0">إظهار الاسم المستعار</h6>

                                    <div className="custom-control custom-switch">
                                        <input 
                                            checked={settings.showNickName}
                                            onChange={this.onChange.bind(this)}
                                            name="showNickName" type="checkbox" className="custom-control-input" id="custom-switch-1" />
                                        <label className="custom-control-label" htmlFor="custom-switch-1"></label>
                                    </div>
                                </div>
                            </li>

                            <li className="list-group-item px-0">
                                <div className="d-flex justify-content-between mb-2">
                                    <h6 className="mb-0">تفعيل الإشعارات</h6>

                                    <div className="custom-control custom-switch">
                                        <input
                                            disabled={true}
                                            checked={settings.enableNotifications}
                                            value={settings.enableNotifications}
                                            name="enableNotifications" type="checkbox" className="custom-control-input" id="custom-switch-2" />
                                        <label className="custom-control-label" htmlFor="custom-switch-2"></label>
                                    </div>
                                </div>
                            </li>

                            <li className="list-group-item px-0">
                                <div className="d-flex justify-content-between mb-2">
                                    <h6 className="mb-0">تفعيل الصوت</h6>

                                    <div className="custom-control custom-switch">
                                        <input
                                            disabled={true}
                                            checked={settings.enableSounds}
                                            name="enableSounds" type="checkbox" className="custom-control-input" id="custom-switch-3" />
                                        <label className="custom-control-label" htmlFor="custom-switch-3"></label>
                                    </div>
                                </div>
                            </li>

                            <li className="list-group-item pb-0 px-0">
                                <div className="d-flex justify-content-between mb-2">
                                    <h6 className="mb-0">الوضع المظلم</h6>

                                    <div className="custom-control custom-switch">
                                        <input
                                            disabled={true}
                                            checked={settings.darkMode}
                                            name="darkMode" type="checkbox" className="custom-control-input" id="custom-switch-4" />
                                        <label className="custom-control-label" htmlFor="custom-switch-4"></label>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        )
    }
}

export default Settings;