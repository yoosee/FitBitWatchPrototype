function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Settings</Text>}>
        <Toggle settingsKey="weatherEnabled" label="Weather Info" />
        <Toggle settingsKey="temperatureUnit" label="Temperature Unit [C/F]" />
        <ColorSelect
          settingsKey="colorTheme"
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'plum'}
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);