import React, { useEffect, useState } from 'react'
import styles from './DocsCard.css'

export const DocsCard = ({ label, imgSrc, link, height = 40, width = 40, title }) => {
    const kubernetesSvg = '/img/setup/icons/kubernetes.svg'

    const imagePath = imgSrc.includes('kubernetes') ? kubernetesSvg : `/img/setup/icons/${imgSrc}.svg`

    const description = {
        "Try JumpStart": "Try out JumpStart with single docker command",
        "Choose Your JumpStart": "Important information on which version of JumpStart to use.",
        "System Requirements": "Learn about system requirements for running JumpStart",
        DigitalOcean: "Quickly deploy JumpStart using the Deploy to DigitalOcean button",
        Docker: "Deploy JumpStart on a server using docker-compose",
        Heroku: "Deploy JumpStart on Heroku using the one-click-deployment button",
        "AWS EC2": "Deploy JumpStart on AWS EC2 instances",
        "AWS ECS": "Deploy JumpStart on AWS ECS instances",
        Openshift: "Deploy JumpStart on Openshift",
        Helm: "Deploy JumpStart with Helm Chart",
        Kubernetes: "Deploy JumpStart on a Kubernetes cluster",
        "Kubernetes (GKE)": "Deploy JumpStart on a GKE Kubernetes cluster",
        "Kubernetes (AKS)": "Deploy JumpStart on a AKS Kubernetes cluster",
        "Kubernetes (EKS)": "Deploy JumpStart on a EKS Kubernetes cluster",
        "Azure container apps": "Deploy JumpStart on a Azure Container Apps",
        "Google Cloud Run": "Deploy JumpStart on Cloud Run with GCloud CLI",
        "Deploying JumpStart client": "Deploy JumpStart Client on static website hosting services",
        "Environment variables": "Environment variables required by JumpStart Client and Server to start running",
        "Connecting via HTTP proxy": "Environment variables required by JumpStart to connect via HTTP proxy",
        "Deploying JumpStart on a subpath": "Steps to deploy JumpStart on a subpath rather than root of domain",
        "V2 migration guide": "Things to know before migrating to JumpStart V2",
        "Upgrading JumpStart to the LTS Version": "Guide to upgrade JumpStart to the latest LTS Version.",
        "JumpStart v3 (Beta) Migration Guide": "Breaking changes and migration guide for JumpStart v3",
        "JumpStart Cloud v3 Migration Guide": "Breaking changes and migration guide for JumpStart Cloud v3",

    }

    return (

        <a href={link} className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card-body">
                <div className="card-icon">
                    <img className='img' src={imagePath} width="100%" />
                </div>
                <div className="card-info">
                    <h3 style={{ margin: "0", paddingBottom: "0.5rem" }}>{label}</h3>
                    <p>
                        {description[label]}
                    </p>
                </div>
            </div>
        </a>
    )
}

