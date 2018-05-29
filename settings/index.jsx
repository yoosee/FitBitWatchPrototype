function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Settings</Text>}>

        <Toggle settingsKey="alwaysOn" label="Display Always On" />
        
        <Select
          label={`Health Status`}  
          settingsKey="healthStatus"
          options={[
            {name:"Steps"},
            {name:"Calories"},
            {name:"Minutes"},
            {name:"Distance"},
            {name:"Elevation"},
            {name:"HeartRate"},
          ]} />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);