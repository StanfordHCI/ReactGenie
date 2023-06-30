import React, { useEffect, useRef } from "react";
import { AllGenieDisplayedInstances } from "./react-decorators";

export const GenieViewWrapper =
  (className: string, childComponent: any, childParams: any[]) => () => {
    const interfaceId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const containerRef = useRef(); // assign to the element we are observing

    useEffect(() => {
      const observer = new IntersectionObserver(callback, {});
      observer.observe(containerRef.current);
      console.log(`GenieViewWrapper: ${className} ${interfaceId} created`);
      return () => {
        observer.disconnect();
        console.log(`GenieViewWrapper: ${className} ${interfaceId} destroyed`);
        delete AllGenieDisplayedInstances[interfaceId];
      };
    }, []);

    // check if dictionary has the interfaceId, if it does update that Id, if it doesn't than you add it.
    // Loop through all elements in the dictionary and check if they are visible, if they are not visible than you remove them from the dictionary.
    const callback = (entries) => {
      const [entry] = entries;
      console.log(
        `GenieViewWrapper: ${className} ${interfaceId} ${entry.isIntersecting}`
      );
      if (entry.isIntersecting) {
        // check if interfaceId is in the dictionary. If it is update it, if it isn't add it.
        const queryInterfaceSpec = () => {
          // @ts-ignore
          const rect = containerRef.current.getBoundingClientRect();
          return {
            className: className,
            key: childParams[0],
            rect: rect,
          };
        };
        if (AllGenieDisplayedInstances[interfaceId] === undefined) {
          AllGenieDisplayedInstances[interfaceId] = queryInterfaceSpec;
        }
      } else {
        // remove self from dictionary
        delete AllGenieDisplayedInstances[interfaceId];
      }
    };

    return (
      <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
        {childComponent(...childParams)}
      </div>
    );
  };
