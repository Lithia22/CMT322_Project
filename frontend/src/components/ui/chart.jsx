import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { value: number; label: string }
function formatYAxis(value, opts = {}) {
  const { suffix } = opts
  return `${value}${suffix || ""}`
}

// Format: number | string
function formatXAxis(value, opts = {}) {
  if (typeof value === "number") {
    return value.toString()
  }
  return value
}

const ChartContainer = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex aspect-video justify-center text-xs", className)}
      {...props}
    >
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(
  ({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, ...props }, ref) => {
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !label) {
        return null
      }

      if (labelFormatter) {
        return labelFormatter(label)
      }

      return label
    }, [hideLabel, label, labelFormatter])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && !hideLabel

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...props}
      >
        {!nestLabel && tooltipLabel && (
          <div
            className={cn("font-medium text-muted-foreground", labelClassName)}
          >
            {tooltipLabel}
          </div>
        )}
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}-${index}`
          const itemColor = color || item.color

          return (
            <div
              key={key}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                nestLabel && "items-center"
              )}
            >
              {!hideIndicator && (
                <div
                  className={cn(
                    "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                    {
                      "h-2.5 w-2.5": indicator === "dot",
                      "w-1": indicator === "line",
                      "w-0": indicator === "none",
                    }
                  )}
                  style={
                    {
                      "--color-bg": itemColor,
                      "--color-border": itemColor,
                    } 
                  }
                />
              )}
              <div
                className={cn(
                  "flex flex-1 justify-between leading-none",
                  nestLabel ? "items-center gap-2" : "items-baseline gap-4"
                )}
              >
                <div className="grid gap-1.5">
                  {nestLabel && tooltipLabel && (
                    <span className="text-muted-foreground">
                      {tooltipLabel}
                    </span>
                  )}
                  <span className="text-foreground font-medium">
                    {item.name}
                  </span>
                </div>
                {item.value && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {formatter
                      ? formatter(item.value, item.name, item)
                      : item.value}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef(
  ({ className, payload, verticalAlign = "bottom", nameKey, ...props }, ref) => {
    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
        {...props}
      >
        {payload.map((item, index) => {
          const key = `${nameKey || item.dataKey || "value"}-${index}`

          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  formatYAxis,
  formatXAxis,
}