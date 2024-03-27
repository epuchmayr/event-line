import * as React from 'react';
import { TextField, Chip } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { element } from 'three/examples/jsm/nodes/Nodes.js';

const filter = createFilterOptions<EventOptionTypePlus>();

export default function AutocompleteCreateOption() {
  const options: EventOptionTypePlus[] = eventTags.map((option) => {
    const firstLetter = option.category[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  const defaultValue = ['Personal'];

  const [value, setValue] = React.useState<string[]>(defaultValue);

  return (
    <>
      <input type='hidden' name='event_tags' value={JSON.stringify(value)} />
      <Autocomplete
        id='tags-outlined'
        multiple
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        onChange={(event, newValue) => {
          const tagsOnly = newValue.map((item) => item.category);
          console.log(
            'inChange',
            newValue.map((item) => item.category)
          );
          setValue(tagsOnly);
        }}
        options={options.sort((a, b) =>
          a.category.localeCompare(b.category[0])
        )}
        defaultValue={defaultValue.map(
          (item) =>
            options[options.findIndex((element) => element.category === item)]
        )}
        isOptionEqualToValue={(option, value) =>
          option.category === value.category
        }
        // filterOptions={(options, params) => {
        //   const filtered = filter(options, params);

        //   const { inputValue } = params;
        //   // Suggest the creation of a new value
        //   const isExisting = options.some(
        //     (option) =>
        //       inputValue.toLowerCase() === option.category.toLowerCase()
        //   );
        //   if (inputValue !== '' && !isExisting) {
        //     // console.log('push', inputValue)
        //     filtered.push({
        //       firstLetter: `${inputValue[0]}`,
        //       category: `${inputValue}`,
        //     });
        //   }

        //   return filtered;
        // }}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.category}
              label={option.category}
            />
          ));
        }}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return `${option.inputValue}`;
          }
          // Regular option
          return option.category;
        }}
        renderInput={(params) => (
          <TextField {...params} label='Tags' placeholder='Find tag...' />
        )}
        autoComplete
      />
    </>
  );
}

interface EventOptionType {
  inputValue?: string;
  category: string;
}

interface EventOptionTypePlus extends EventOptionType {
  firstLetter?: string | undefined;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const eventTags: readonly EventOptionType[] = [
  { category: 'Personal' },
  { category: 'Family' },
  { category: 'Household' },
  { category: 'Friends' },
  { category: 'Garden' },
  { category: `Travel` },
  { category: 'Events' },
];
