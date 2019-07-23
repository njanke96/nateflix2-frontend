import React from "react"
import BaseAdminPage from "./BaseAdminPage"

export default class Users extends BaseAdminPage {
    pageRender() {
        return (
            <div>
                <div className="table-container">
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>E-mail</th>
                                <th>Admin</th>
                                <th>Last active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>njanke96</td>
                                <td>nathanjanke96@gmail.com</td>
                                <td>Yes</td>
                                <td>Some time ago</td>
                            </tr>
                            <tr>
                                <td>njanke96</td>
                                <td>nathanjanke96@gmail.com</td>
                                <td>Yes</td>
                                <td>Some time ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}