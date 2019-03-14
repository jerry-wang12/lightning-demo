---
examples:
 - name: decimal
   label: Decimal Formatting
   description: Decimal numbers default to 3 decimal places. You can change the integer and fraction portions of the decimal number display with several attributes.
 - name: currency
   label: Currency Formatting
   description: Currency numbers default to 2 decimal places. You can change the integer and fraction portions of the currency number display with several attributes. You can change the currency code using the currency-code attribute.
 - name: percent
   label: Percent Formatting
   description: Percentages default to 0 decimal places. You can change the integer and fraction portions of the currency number display with several attributes.
---
A `lightning-formatted-number` component displays formatted numbers for
decimals, currency, and percentages. Use `format-style` to specify the
number style. This component uses the Intl.NumberFormat
JavaScript object to format numerical values. The locale set in the app's user
preferences determines how numbers are formatted.

The component has several attributes that specify how number formatting is
handled in your app. Among these attributes are `minimum-significant-digits` and
`maximum-significant-digits`. Significant digits refer to the accuracy of a number.
For example, 1000 has one significant digit, but 1000.0 has five significant
digits. Additionally, the number of decimal places can be customized using
`maximum-fraction-digits`.

Decimal numbers default to 3 decimal places. This example returns `1234.568`.

```html
<template>
    <lightning-formatted-number value="1234.5678">
    </lightning-formatted-number>
</template>
```

Currencies default to 2 decimal places. In this example, the formatted number
displays as $5,000.00.

```html
<template>
    <lightning-formatted-number
            value="5000"
            format-style="currency"
            currency-code="USD">
    </lightning-formatted-number>
</template>
```
The `currency-display-as` attribute changes the currency display to use the symbol, code, or name of the currency.

Percentages default to 0 decimal places. In this example, the formatted number
displays as 50%.

```html
<template>
    <lightning-formatted-number
            value="0.503"
            format-style="percent">
    </lightning-formatted-number>
</template>
```

#### Usage Considerations

Arabic, Hindi, and Persian numbers are not supported by `lightning-formatted-number`.
