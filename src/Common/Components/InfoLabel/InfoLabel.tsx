import "./InfoLabel.scss";

import * as React from "react";

import { IBaseFluxComponentProps } from "Common/Components/Utilities/BaseFluxComponent";
import { Label } from "OfficeFabric/Label";
import { DirectionalHint, TooltipDelay, TooltipHost } from "OfficeFabric/Tooltip";
import { css } from "OfficeFabric/Utilities";
import { VssIcon, VssIconType } from "VSSUI/VssIcon";

export interface IInfoLabelProps extends IBaseFluxComponentProps {
    label: string;
    info?: string | Element;
}

export const InfoLabel: React.StatelessComponent<IInfoLabelProps> = (props: IInfoLabelProps): JSX.Element => {
    return (
        <div className={css("info-label", props.className)}>
            <Label className="info-label-text">{props.label}</Label>
            {props.info && (
                <TooltipHost content={typeof props.info === 'string' ? props.info : props.info.textContent || ''} delay={TooltipDelay.zero} directionalHint={DirectionalHint.bottomCenter}>
                    <VssIcon iconType={VssIconType.Fabric} className="info-icon" iconName="Info" />
                </TooltipHost>
            )}
        </div>
    );
};
