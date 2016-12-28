import {Component} from "@angular/core";
import {Config} from "../../../providers/config";
import {SessionProvider} from "../../../providers/session";
import {ConfigurationProvider} from "../../../providers/configuration";

@Component({
    templateUrl: 'config.html',
})
export class ConfigSettingsPage {
    saving: boolean = false;
    dirty: boolean = false;
    weight: number = 0;

    constructor(private config: Config, private session: SessionProvider, private configurationProvider: ConfigurationProvider) {
        this.configurationProvider.getSingle(0).then((configuration: any) => {
            this.weight = configuration.assessmentWeight;
        });
    }

    setDirty() {
        this.dirty = true;
    }

    save() {
        let comp = this;
        this.saving = true;
        let configuration = {assessmentWeight: this.weight, outcomeWeight: 10 - this.weight};
        this.configurationProvider.update(configuration, false).then((result) => {
            comp.saving = false;
            comp.dirty = false;
        });
    }
}