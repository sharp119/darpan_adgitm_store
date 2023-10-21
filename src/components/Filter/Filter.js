import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { updateFilter } from "../../store/filter"
import styles from "./Filter.module.scss"

function Filter({ dispatch, products, filter }) {
	let [projects, updateProjects] = useState(null)

	// uncomment below lines to prevent screen scrolling when filter is open
	// useEffect(() => {
	// document.body.classList.toggle("noScroll", filter.show)
	// }, [filter.show])

	useEffect(() => {
		if (!products) return
		let newProjects = {}
		for (const product of products) {
			const project = product.project || "Other"
			if (newProjects[project]) newProjects[project]++
			else newProjects[project] = 1
		}
		updateProjects(newProjects)
	}, [products])

	const onProjectClick = projectName => {
		let projects = new Set(filter.projects)
		if (projects.has(projectName)) {
			projects.delete(projectName)
		} else projects.add(projectName)

		dispatch(updateFilter({ ...filter, projects }))
	}

	return (
		<>
			<div className={[styles.filter, filter.show ? styles.show : styles.close].join(" ")}>
				<div className={styles.body}>
					{projects && (
						<>
							<p className={styles.categoryHeading}>Projects</p>
							<ul className={styles.categoryList}>
								{Object.entries(projects).map(([name, count]) => (
									<li
										key={name}
										onClick={() => onProjectClick(name)}
										className={filter.projects.has(name) ? styles.selected : ""}>
										<span className={styles.name}>{name}</span>
										<span className={styles.count}>{count}</span>
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
		</>
	)
}

const mapStateToProps = (state, ownProps) => ({
	...ownProps,
	products: state.products,
	filter: state.filter,
})

export default connect(mapStateToProps)(Filter)
