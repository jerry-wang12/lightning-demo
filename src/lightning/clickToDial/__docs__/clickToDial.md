---
examples:
 - name: basic
   label: Basic Click-to-Dial
   description: Three click-to-dial enabled phone numbers.
 - name: simulatePhoneSystemManagement
   label: Simulate Phone System Management
   description: Simulates enabling and disabling a phone system using Open CTI. You can also add an onClickToDial handler.
---
A `lightning-click-to-dial` component respects any existing click-to-dial
commands for computer-telephony integrations (CTI) with Salesforce, such as
Open CTI and Voice.

To dial phone numbers in the component, you must first enable the phone
system. After the phone system is enabled, when a user clicks on a phone
number the component notifies the phone system that the number was clicked.
Then, the component passes along any information that's required by the phone
system to make an outbound call.

Here's an example of how you can use a `lightning-click-to-dial` component. The
first phone number doesn't have a recordId or any parameters. The second phone
number has a recordId. The third phone number has a recordId and parameters.

 ```html
 <template>
      <lightning-click-to-dial
            value="14155555551">
      </lightning-click-to-dial>
      <lightning-click-to-dial
            value="14155555552"
            record-id="5003000000D9duF">
      </lightning-click-to-dial>
      <lightning-click-to-dial
            value="14155555553"
            record-id="5003000000D8cuI"
            params="accountSid=xxx, sourceId=xxx, apiVersion=123">
      </lightning-click-to-dial>
 </template>
```


#### Open CTI Usage Considerations

The `lightning-click-to-dial` component works in conjunction with the Open CTI
for Lightning Experience API methods, `enableClickToDial`,
`disableClickToDial`, and `onClickToDial`. For more information, see the
[Open CTI Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_cti.meta/api_cti/).
The component doesn't support iFrames, which means
that it can't be used in utilities, such as a phone utility, or Lightning Out
apps that are hosted on iFrames.

To dial phone numbers using `lightning-click-to-dial`, first enable the phone
system with the Open CTI method `enableClickToDial`. To disable the phone
system, use the Open CTI method `disableClickToDial`.

When a phone number is clicked, the `onClickToDial` listener that's registered
with the Open CTI method `onClickToDial` is invoked.

`lightning-click-to-dial` can contain a `record-id` attribute. If you pass this
attribute, the payload that's passed to the Open CTI method `onClickToDial`
contains the record information associated with this record ID. For example,
record name and object type. If the `record-id` isn't passed, no record
information is provided to the `onClickToDial` handler.

A formatted phone number follows the North American format of 123 456 7890.


