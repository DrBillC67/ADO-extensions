import * as React from "react";

import { BasePicker } from "@fluentui/react/lib/components/pickers/BasePicker";
import { IBasePickerProps } from "@fluentui/react/lib/components/pickers/BasePicker.types";
import { IPickerItemProps } from "@fluentui/react/lib/components/pickers/PickerItem.types";
import { TagItem } from "@fluentui/react/lib/components/pickers/TagPicker/TagItem";
import { ITag } from "@fluentui/react/lib/components/pickers/TagPicker/TagPicker";
import { mergeStyles } from "@fluentui/react";

export interface ICustomTagPickerProps extends IBasePickerProps<ITag> {
    suggestionsListClassName?: string;
    onToggleCallout(show: boolean): void;
}

export class CustomTagPicker extends BasePicker<ITag, ICustomTagPickerProps> {
    protected static defaultProps = {
        onRenderItem: (props: IPickerItemProps<ITag>) => {
            return <TagItem {...props}>{props.item.name}</TagItem>;
        },
        onRenderSuggestionsItem: (props: ITag) => <div className={mergeStyles("ms-TagItem-TextOverflow")}>{props.name}</div>
    };

    protected renderSuggestions(): JSX.Element | null {
        this.props.onToggleCallout(this.state.suggestionsVisible);

        const TypedSuggestion = this.SuggestionOfProperType;
        return this.state.suggestionsVisible && this.input ? (
            <TypedSuggestion
                className={this.props.suggestionsListClassName}
                onRenderSuggestion={this.props.onRenderSuggestionsItem}
                onSuggestionClick={this.onSuggestionClick}
                onSuggestionRemove={this.onSuggestionRemove}
                suggestions={this.suggestionStore.getSuggestions()}
                ref={this._resolveRef("suggestionElement")}
                onGetMoreResults={this.onGetMoreResults}
                moreSuggestionsAvailable={this.state.moreSuggestionsAvailable}
                isLoading={this.state.suggestionsLoading}
                isSearching={this.state.isSearching}
                isMostRecentlyUsedVisible={this.state.isMostRecentlyUsedVisible}
                isResultsFooterVisible={this.state.isResultsFooterVisible}
                refocusSuggestions={this.refocusSuggestions}
                removeSuggestionAriaLabel={this.props.removeButtonAriaLabel}
                {...this.props.pickerSuggestionsProps as any}
            />
        ) : null;
    }
}
