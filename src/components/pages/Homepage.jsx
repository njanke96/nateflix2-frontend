import React from "react"
import BasePage from "./BasePage"
import { observer } from "mobx-react"

@observer
export default class Homepage extends BasePage {
    pageRender() {
        return (
            <div>
                <p>Homepage will go here.</p>
            </div>
        )
    }
}